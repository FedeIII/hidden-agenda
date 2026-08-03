import { WebGLRenderer, ColorManagement, NeutralToneMapping, SRGBColorSpace } from 'three';
import isWebGLAvailable, { isSoftwareRenderer } from './support';
import { BACKDROP } from './palette';

// One renderer, one canvas, many views.
//
// The board and the four HQ stores are five separate scenes anchored to five separate DOM
// elements, and the obvious way to draw them is five canvases. That is five WebGL contexts, five
// copies of every geometry and texture, and a browser limit (around sixteen) that other tabs are
// also spending. So instead: a single canvas pinned over the viewport, and each view rendered
// into the scissor rectangle of the element it belongs to. Layout stays entirely CSS's problem —
// the views simply follow whatever boxes the flexbox hands them, through every breakpoint.
//
// The canvas sits behind .game and takes no pointer events. Everything clickable is still the DOM
// it always was.

const MAX_PIXEL_RATIO = 2;

// How often to look at the DOM when nothing is moving and nothing has asked to be drawn: ten
// times a second rather than sixty. Layout shifts that neither resize a view nor change any game
// state are the only thing this can be late for, and a tenth of a second late is not late.
const IDLE_POLL_FRAMES = 6;

let stage = null;
let failed = false;
const failureListeners = new Set();

function reportFailure() {
	if (failed) {
		return;
	}

	failed = true;

	// Without this the board would simply be gone: the DOM that replaced it is transparent on
	// purpose. Everything that draws in 3D listens, and puts the flat renderer back.
	for (const listener of failureListeners) {
		listener();
	}
}

export function onStageFailure(listener) {
	failureListeners.add(listener);

	return () => failureListeners.delete(listener);
}

export function hasStageFailed() {
	return failed;
}

// A player who has asked their system for less movement gets none: pieces appear where they are
// rather than travelling there, and a lit sniper stays lit rather than pulsing. The flat renderer
// only ever animated for 200ms at a time, so continuous motion is something this layer introduced
// and something it should be able to withdraw.
export function prefersReducedMotion() {
	return (
		typeof window !== 'undefined' &&
		!!window.matchMedia &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches
	);
}

function createCanvas() {
	const canvas = document.createElement('canvas');

	canvas.id = 'three-stage';
	canvas.setAttribute('aria-hidden', 'true');
	Object.assign(canvas.style, {
		position: 'fixed',
		top: '0',
		left: '0',
		width: '100%',
		height: '100%',
		display: 'block',
		pointerEvents: 'none',
		zIndex: '0',
	});

	return canvas;
}

const UNCLIPPED = { left: -Infinity, top: -Infinity, right: Infinity, bottom: Infinity };

// Everything the game draws lives inside .game, which scrolls and clips. Read once per frame
// rather than cached, because it moves with the layout and there is nothing to observe it with
// that is cheaper than asking.
function getClipRect() {
	const game = document.querySelector('.game');

	return game ? game.getBoundingClientRect() : UNCLIPPED;
}

function createStage() {
	const canvas = createCanvas();
	let renderer;
	let software;

	try {
		software = isSoftwareRenderer();

		renderer = new WebGLRenderer({
			canvas,
			// Off on a CPU rasteriser, where multisampling costs four times the fragment work for
			// an edge nobody is going to lean in and inspect. The answer comes from a throwaway
			// probe canvas in support.js and not from this one, because a second getContext on a
			// canvas returns the first context and silently discards the attributes — which is how
			// this ran 4x multisampling on SwiftShader for a while whilst claiming not to.
			antialias: !software,
			// The page's own background shows through everywhere a view is not drawing, so the
			// canvas never has to paint the parts of the screen it does not own.
			alpha: true,
			powerPreference: 'high-performance',
		});
	} catch {
		// Throws rather than returning null when it cannot get a webgl2 context, which since r163
		// is the only kind it takes.
		return null;
	}

	// Re-read on every resize rather than captured: it changes when a window moves between
	// displays of different density, and when the page is zoomed.
	const getPixelRatio = () => (software ? 1 : Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));

	ColorManagement.enabled = true;
	renderer.outputColorSpace = SRGBColorSpace;
	// Neutral rather than ACES. ACES rolls saturated colour off towards white, and this board is
	// identified by exactly four of them — a red team and a yellow team that have to stay a red
	// team and a yellow team. Neutral is built to hold saturation and still not clip.
	renderer.toneMapping = NeutralToneMapping;
	renderer.toneMappingExposure = 1.05;
	renderer.setClearColor(BACKDROP, 0);
	// Shadow maps are the single most expensive thing we could switch on, and the suite renders
	// through SwiftShader. Contact shadows are a painted texture instead — see boardScene.
	renderer.shadowMap.enabled = false;
	// Views composite rather than each clearing its own rectangle: the canvas is wiped once at the
	// start of a frame and every view then paints over what is already there, with only the depth
	// buffer reset between them. That is what lets a carried piece be drawn by the board, on top of
	// the tray it was lifted out of.
	renderer.autoClear = false;

	document.body.appendChild(canvas);

	const views = new Set();
	let width = 0;
	let height = 0;
	let frame = null;
	let previous = 0;
	// Set whenever something has to be drawn: a view was added, resized, moved, or told its state
	// changed. Cleared by drawing.
	let pending = true;
	// Whether the last pass found anything still in motion, which is what decides whether the next
	// frame is worth a full look.
	let animating = false;
	let idle = 0;

	function resize() {
		const nextWidth = window.innerWidth;
		const nextHeight = window.innerHeight;

		if (nextWidth === width && nextHeight === height) {
			return;
		}

		width = nextWidth;
		height = nextHeight;

		renderer.setPixelRatio(getPixelRatio());
		// updateStyle false: the canvas is sized by CSS to fill the viewport and must stay that
		// way, whatever the drawing buffer underneath it is.
		renderer.setSize(width, height, false);
		pending = true;
	}

	function draw(now) {
		// Capped: a backgrounded tab resumes with an enormous gap, and a tween handed that would
		// jump rather than animate.
		const delta = Math.min((now - previous) / 1000, 0.1);
		previous = now;

		// At rest nothing in the scene is moving and nothing has asked to be redrawn, so the only
		// reason to look at all is in case the layout shifted underneath us — which ten times a
		// second is plenty for. Otherwise a finished board costs six bounding-box reads and a pass
		// over 37 tiles and 32 tokens, sixty times a second, for the length of a game.
		if (!pending && !animating && ++idle < IDLE_POLL_FRAMES) {
			return;
		}

		idle = 0;
		resize();

		const onScreen = [];
		let repaint = pending;

		animating = false;
		pending = false;

		// .game is a scroll container, so it clips its own contents — but the canvas is its
		// sibling, not its child, and nothing clips that. Without intersecting here, a scrolled
		// board would paint straight over the title and the action bar.
		const clip = getClipRect();

		for (const view of views) {
			const rect = view.element.getBoundingClientRect();

			if (rect.width < 1 || rect.height < 1) {
				continue;
			}

			if (
				view.rect.width !== rect.width ||
				view.rect.height !== rect.height ||
				view.rect.left !== rect.left ||
				view.rect.top !== rect.top
			) {
				if (view.rect.width !== rect.width || view.rect.height !== rect.height) {
					view.onResize(rect.width, rect.height);
				}

				view.rect = rect;
				repaint = true;
			}

			if (view.update(delta)) {
				animating = true;
				repaint = true;
			}

			if (view.dirty) {
				repaint = true;
			}

			view.dirty = false;

			// Four rectangles intersected: the element's own box, the part of it the scene actually
			// paints into, the part of that still inside the scrolling container, and the canvas.
			//
			// Clamping to the element's box on ALL four sides, not just right and bottom: a scene
			// reports its painted extent with a little slack around it, and a scissor that reached
			// past its own element would clear a strip of whichever view is next door — which is
			// exactly what it did, taking a bite out of the HQ tray beside the board.
			// Unless the view says it has something in the air, in which case it is allowed the whole
			// of the scrolling container to draw it in. Nothing else in the scene reaches past the
			// bounds the camera was fitted to, so widening the scissor reveals only the thing that
			// asked for it.
			const painted = view.overlay() ? null : view.extent();

			const left = painted ? Math.max(rect.left + painted.left, rect.left, clip.left, 0) : Math.max(clip.left, 0);
			const right = painted
				? Math.min(rect.left + painted.right, rect.right, clip.right, width)
				: Math.min(clip.right, width);
			const top = painted ? Math.max(rect.top + painted.top, rect.top, clip.top, 0) : Math.max(clip.top, 0);
			const bottom = painted
				? Math.min(rect.top + painted.bottom, rect.bottom, clip.bottom, height)
				: Math.min(clip.bottom, height);

			// Scrolled out of sight, or clipped away entirely. Costs nothing.
			if (right - left < 1 || bottom - top < 1) {
				continue;
			}

			// The viewport has to go with it. A scissor on its own does not let a view draw
			// outside its element: the viewport is a hard edge, and a token halfway out of an HQ
			// tray came out cut off at the board's own left edge, to the pixel. So a view that
			// asked for the overlay is given the whole rectangle to project into, and told to
			// re-frame itself so every pixel it already had stays exactly where it was.
			const viewport = painted ? rect : { left, top, right, bottom, width: right - left, height: bottom - top };

			if (view.widen) {
				view.widen(
					painted
						? null
						: {
								left: viewport.left - rect.left,
								top: viewport.top - rect.top,
								width: viewport.width,
								height: viewport.height,
							},
				);
			}

			onScreen.push({
				viewport,
				scissor: { left, top, right, bottom },
				scene: view.scene,
				camera: view.camera,
				order: view.order,
			});
		}

		// The board goes last so a piece it is carrying is drawn over the trays rather than under
		// them. Views are otherwise in mount order, which is HQ, HQ, board, HQ, HQ.
		onScreen.sort((a, b) => a.order - b.order);

		if (!repaint) {
			return;
		}

		// All of them, or none. Repainting only the view that changed was tried and is not worth
		// having: it saved nothing measurable, because what costs is filling pixels rather than
		// issuing draws — and it left a tray blank whenever one view repainted without the clear
		// the others were relying on.
		renderer.setScissorTest(false);
		renderer.clear();
		renderer.setScissorTest(true);

		for (const { viewport, scissor, scene, camera } of onScreen) {
			// The viewport is the whole anchor element, because that is what the camera was fitted
			// to and what the DOM overlay was projected against — or the overlay rectangle, for a
			// view that asked for one and has re-framed itself to match. The scissor is the part of
			// it still visible. WebGL counts from the bottom left; the DOM counts from the top left.
			renderer.setViewport(viewport.left, height - viewport.bottom, viewport.width, viewport.height);
			renderer.setScissor(
				scissor.left,
				height - scissor.bottom,
				scissor.right - scissor.left,
				scissor.bottom - scissor.top,
			);
			// Colour composites; depth does not. Each view is its own little world and must not be
			// occluded by whatever the last one left in the depth buffer.
			renderer.clearDepth();
			renderer.render(scene, camera);
		}

		renderer.setScissorTest(false);
	}

	// Re-armed before the work, not after, so a throw cannot leave the loop holding a frame id it
	// will never receive — and caught, because an exception escaping here would be an uncaught
	// page error AND a board frozen mid-frame with every piece still invisible on top of it. If
	// the renderer has thrown once it does not get called again: the flat board is put back, which
	// it can do without losing anything.
	function tick(now) {
		frame = requestAnimationFrame(tick);

		try {
			draw(now);
		} catch (error) {
			console.error('three: giving up on the 3D board', error);
			teardown();
			reportFailure();
		}
	}

	function teardown() {
		if (frame !== null) {
			cancelAnimationFrame(frame);
			frame = null;
		}

		views.clear();
		renderer.dispose();
		canvas.remove();
		stage = null;
	}

	function start() {
		if (frame === null && views.size) {
			previous = performance.now();
			frame = requestAnimationFrame(tick);
		}
	}

	canvas.addEventListener(
		'webglcontextlost',
		event => {
			// preventDefault is what would let the context come back, and three.js would happily
			// rebuild on it. We decline: the flat board is right there, it cannot lose anything,
			// and a phone that took the context away once — backgrounding the tab, memory
			// pressure — will do it again. Everything goes with it rather than leaving a dead
			// full-viewport canvas and a renderer's worth of GPU memory resident for the session.
			event.preventDefault();
			teardown();
			reportFailure();
		},
		false,
	);

	return {
		renderer,

		/**
		 * @returns a handle: invalidate() marks this one view for a repaint, remove() takes it out.
		 */
		addView(view) {
			// Defaults AFTER the spread, not before: a scene that simply has no opinion passes the
			// key through as undefined, and a default that was merely spread over would be replaced
			// by it — which is a call to undefined once a frame, inside the loop.
			const entry = {
				...view,
				order: view.order || 0,
				overlay: view.overlay || (() => false),
				rect: { width: 0, height: 0, left: 0, top: 0 },
				dirty: true,
			};

			views.add(entry);
			pending = true;
			start();

			return {
				invalidate() {
					entry.dirty = true;
					// Wakes the loop out of its idle cadence, so a click is drawn on the next frame
					// rather than up to a tenth of a second later.
					pending = true;
				},
				remove() {
					views.delete(entry);
					pending = true;

					// Nothing to draw and nothing to watch for. The phases before and after the
					// game have no 3D in them at all, and neither should have a frame loop — but
					// the canvas has to be wiped on the way out, or the last frame of the board
					// stays painted behind the score table for the rest of the session.
					if (!views.size && frame !== null) {
						cancelAnimationFrame(frame);
						frame = null;
						renderer.setScissorTest(false);
						renderer.clear();
					}
				},
			};
		},

		// For the things no view can know it is waiting for — a piece texture finishing its
		// download is the only one, and it is worth one repaint of everything.
		invalidateAll() {
			pending = true;
		},

		dispose: teardown,
	};
}

export default function getStage() {
	if (failed) {
		return null;
	}

	if (!stage) {
		if (!isWebGLAvailable()) {
			reportFailure();

			return null;
		}

		stage = createStage();

		if (!stage) {
			reportFailure();
		}
	}

	return stage;
}
