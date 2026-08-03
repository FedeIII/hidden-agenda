import { PerspectiveCamera, Vector3, MathUtils } from 'three';
import { BOARD_ELEVATION } from './layout';

// The camera, and the arithmetic that turns a point in the scene into a pixel in the page.
//
// This is the hinge the whole approach turns on. The hexagon a player clicks is still a DOM
// element — it has to be, because that is what the drag controller hit-tests with
// elementFromPoint and what every spec in the suite asserts against — so its box has to land
// exactly on top of the tile the renderer draws. Rather than measure the scene and hope, both
// sides run this same function: the camera is a pure function of the container's width and
// height, and so is the projection.
//
// Pure also means stable, which matters more than it looks: playwright will not click an element
// whose bounding box is still moving. Overlay boxes are projected from a cell's resting centre,
// never from an animating token, so nothing a tween does can make a click miss.

const UP = new Vector3(0, 1, 0);

// A long lens. Wide-angle would foreshorten the far rows of a seven-row board into mush, and the
// point of tilting at all is depth, not drama — at 22 degrees the board reads nearly isometric
// while the tiles still visibly have sides.
const FOV = 22;

const FIT_ITERATIONS = 16;

function directionFromElevation(elevation) {
	const angle = MathUtils.degToRad(elevation);

	// Looking down the +z axis from above and in front, so rows further up the board are further
	// away — which is the way the flat board already reads.
	return new Vector3(0, Math.sin(angle), Math.cos(angle)).normalize();
}

function projectNdc(camera, point, out) {
	out.copy(point).project(camera);

	return out;
}

/**
 * Builds a camera that frames `points` inside a container of the given size, whatever its shape.
 *
 * The board lives in a box that is 45% of a desktop row and the full width of a phone, and the
 * HQ trays are near-square; rather than keep a table of magic distances per breakpoint, the
 * camera solves for its own. Distance and pan converge together: scale until the bounds fit,
 * shift until they are centred, repeat. Sixteen passes is far past convergence and still costs
 * nothing — it runs on resize, not per frame.
 */
function fitCamera(camera, points, width, height, padding, elevation) {
	const aspect = width / height;
	const limit = 1 - padding;
	const direction = directionFromElevation(elevation);

	const target = new Vector3();
	for (const point of points) {
		target.add(point);
	}
	target.divideScalar(points.length || 1);

	camera.fov = FOV;
	camera.aspect = aspect;
	camera.near = 0.1;
	camera.updateProjectionMatrix();

	const ndc = new Vector3();
	const right = new Vector3();
	const up = new Vector3();
	const forward = new Vector3();
	let distance = 40;

	for (let pass = 0; pass < FIT_ITERATIONS; pass++) {
		camera.position.copy(direction).multiplyScalar(distance).add(target);
		camera.up.copy(UP);
		camera.lookAt(target);
		camera.updateMatrixWorld(true);
		camera.updateProjectionMatrix();

		let minX = Infinity;
		let maxX = -Infinity;
		let minY = Infinity;
		let maxY = -Infinity;

		for (const point of points) {
			projectNdc(camera, point, ndc);

			minX = Math.min(minX, ndc.x);
			maxX = Math.max(maxX, ndc.x);
			minY = Math.min(minY, ndc.y);
			maxY = Math.max(maxY, ndc.y);
		}

		const overflow = Math.max((maxX - minX) / (2 * limit), (maxY - minY) / (2 * limit));
		const offsetX = (minX + maxX) / 2;
		const offsetY = (minY + maxY) / 2;

		// Pan rather than swing: moving the target keeps the tilt, and the tilt is the look.
		const halfHeight = Math.tan(MathUtils.degToRad(FOV) / 2) * distance;
		const halfWidth = halfHeight * aspect;

		camera.matrixWorld.extractBasis(right, up, forward);
		target.addScaledVector(right, offsetX * halfWidth).addScaledVector(up, offsetY * halfHeight);

		distance *= overflow;
	}

	camera.position.copy(direction).multiplyScalar(distance).add(target);
	camera.up.copy(UP);
	camera.lookAt(target);
	camera.far = distance * 3;
	camera.updateProjectionMatrix();
	camera.updateMatrixWorld(true);

	return camera;
}

/**
 * The screen box of a cell or a socket, ready to hand straight to an element's `style`.
 *
 * CSS lengths rather than numbers, and an inline style rather than a styled-component template,
 * because styled-components hashes and injects a new rule for every distinct value it is given
 * and never reclaims one. Interpolating a projected pixel offset into a template mints a class per
 * hexagon per layout — sixty thousand rules after a couple of hundred pixels of window dragging.
 */
export function boxStyle(projector, x, z, y, halfWidth, halfDepth) {
	const left = projector.project(x - halfWidth, y, z);
	const right = projector.project(x + halfWidth, y, z);
	const top = projector.project(x, y, z - halfDepth);
	const bottom = projector.project(x, y, z + halfDepth);

	return {
		left: `${left.x.toFixed(2)}px`,
		top: `${top.y.toFixed(2)}px`,
		width: `${(right.x - left.x).toFixed(2)}px`,
		height: `${(bottom.y - top.y).toFixed(2)}px`,
	};
}

/**
 * A camera plus the projection that goes with it, for one container size.
 *
 * `bounds` is what must stay on screen. For the board that deliberately includes the ring of
 * cells past the edge: they are only there so a piece can be pointed off the board, but they are
 * clickable, and a clickable box that escaped its container would sit invisibly over an HQ button
 * and swallow its clicks.
 */
export default function createProjector({ bounds, padding = 0.04, elevation = BOARD_ELEVATION }) {
	const camera = new PerspectiveCamera();
	// What the renderer is handed, which is not always the camera the maths is done with: see
	// `widen`. `camera` is the one that answers questions about where things are, and it is never
	// touched by anything the renderer is doing this frame — every DOM overlay box, and every
	// pointer position the drag controller turns into a place on the board, comes through it.
	const renderCamera = new PerspectiveCamera();
	const scratch = new Vector3();

	let width = 1;
	let height = 1;
	let painted = { left: 0, top: 0, right: 1, bottom: 1 };

	return {
		camera: renderCamera,

		resize(nextWidth, nextHeight) {
			width = Math.max(nextWidth, 1);
			height = Math.max(nextHeight, 1);

			fitCamera(camera, bounds, width, height, padding, elevation);
			// copy() takes the view offset with it, so a resize mid-flight lands back on the element's
			// own box and the next frame widens it again.
			renderCamera.copy(camera);

			// What this view actually paints into, which is not the same as the box it was given.
			// The board is fitted by width and centred in whatever height the layout hands it, so
			// on a desktop nearly half of its box is empty — and clearing and shading those pixels
			// every frame is free to stop doing. Scissoring to this changes nothing on screen.
			let left = Infinity;
			let top = Infinity;
			let right = -Infinity;
			let bottom = -Infinity;

			for (const point of bounds) {
				const at = this.project(point.x, point.y, point.z);

				left = Math.min(left, at.x);
				right = Math.max(right, at.x);
				top = Math.min(top, at.y);
				bottom = Math.max(bottom, at.y);
			}

			// Slack for a lifted token and for the sub-pixel edge of a chamfer.
			const slack = Math.max(width, height) * 0.05;
			painted = { left: left - slack, top: top - slack, right: right + slack, bottom: bottom + slack };
		},

		/** In the container's own pixels, relative to its top left corner. */
		extent() {
			return painted;
		},

		/**
		 * Draw into a rectangle bigger than the element, without moving anything already in it.
		 *
		 * A scissor is not enough on its own. The viewport is a hard edge — WebGL clips a primitive
		 * to it whatever the scissor allows — so a token carried out of an HQ tray came out sliced
		 * off at the board's own left edge, right down to the pixel. Widening the viewport alone
		 * would rescale the board inside it, which would move every hexagon out from under the
		 * invisible box that gets clicked; so the frustum is pushed off centre by exactly the amount
		 * that puts the element's own rectangle back on the pixels it already had. The extra
		 * rectangle around it is then extra, rather than zoom.
		 *
		 * @param box the rectangle to draw into, in the element's own pixels — its left and top are
		 *            usually negative — or null to go back to the element's own box.
		 */
		widen(box) {
			if (!box) {
				if (renderCamera.view && renderCamera.view.enabled) {
					renderCamera.clearViewOffset();
				}

				return;
			}

			// "Full size" is the element, and the sub-window is bigger than it and offset backwards,
			// which is the reverse of what setViewOffset is usually for. The arithmetic is linear and
			// does not mind. It also sets the aspect from the full size, which is the element's — so
			// the camera the board was fitted to is unchanged.
			renderCamera.setViewOffset(width, height, box.left, box.top, box.width, box.height);
		},

		// To CSS pixels, relative to the container's top left corner — which is exactly what an
		// absolutely positioned overlay wants.
		project(x, y, z) {
			projectNdc(camera, scratch.set(x, y, z), scratch);

			return {
				x: (scratch.x * 0.5 + 0.5) * width,
				y: (-scratch.y * 0.5 + 0.5) * height,
			};
		},

		/**
		 * And back again: a pixel on screen to the point on a horizontal plane it is pointing at.
		 *
		 * This is what lets a piece be dragged. The pointer is somewhere in the page and the token
		 * has to be somewhere in the scene, and the two are only related through this camera — so
		 * the ray it casts is followed down to the height the token floats at, and that is where
		 * the token goes. Points outside the container work exactly as well as points inside it,
		 * which is the whole reason a piece can be carried out of an HQ and over the board.
		 */
		unproject(x, y, planeY) {
			scratch.set((x / width) * 2 - 1, -(y / height) * 2 + 1, 0.5).unproject(camera);
			scratch.sub(camera.position).normalize();

			// Parallel to the plane, or behind the camera: nothing sensible to return.
			if (Math.abs(scratch.y) < 1e-6) {
				return null;
			}

			const along = (planeY - camera.position.y) / scratch.y;

			if (along < 0) {
				return null;
			}

			return {
				x: camera.position.x + scratch.x * along,
				z: camera.position.z + scratch.z * along,
			};
		},
	};
}
