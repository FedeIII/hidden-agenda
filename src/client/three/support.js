// What the browser will give us, asked once.
//
// The 3D layer is a skin: the DOM underneath it is the same DOM as before, so falling back costs
// nothing but the look. That matters more than it sounds — a browser can refuse a WebGL context
// for reasons that have nothing to do with the browser (a blocklisted driver, a lost context, too
// many live contexts in other tabs), and a game that showed a blank rectangle in those cases
// would be worse than one that never tried.

let capabilities;

// A browser with no GPU driver it trusts rasterises on the CPU instead — SwiftShader in Chrome,
// llvmpipe on Linux — and so does headless chromium, which is what the test suite runs on. It
// works, but multisampling costs four times the fragment work and a retina buffer four times
// again, and neither is worth having when a frame is being drawn by the processor.
const SOFTWARE = /swiftshader|llvmpipe|software|basic render/i;

function detect() {
	if (typeof window === 'undefined' || typeof document === 'undefined') {
		return { webgl: false, software: false };
	}

	// ?flat is an escape hatch for anyone who wants the original renderer back, including us when
	// a bug needs isolating to one side or the other.
	if (new URLSearchParams(window.location.search).has('flat')) {
		return { webgl: false, software: false };
	}

	try {
		// WebGL2 only, and not out of ambition: three.js dropped WebGL1 in r163 and its renderer
		// constructor throws rather than returning null when it cannot get a webgl2 context.
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('webgl2');

		if (!context) {
			return { webgl: false, software: false };
		}

		const debug = context.getExtension('WEBGL_debug_renderer_info');
		const name = String(
			debug ? context.getParameter(debug.UNMASKED_RENDERER_WEBGL) : context.getParameter(context.RENDERER),
		);

		// Contexts are a scarce resource and this one existed only to answer the question. Chrome
		// keeps a handful alive at a time and evicts the oldest, which would take the real
		// renderer's context down with it. It also has to be a throwaway canvas rather than the
		// one the renderer will use: a second getContext on a canvas returns the first context and
		// discards whatever attributes it was asked for, so probing the real canvas would make the
		// answer impossible to act on.
		const lose = context.getExtension('WEBGL_lose_context');

		if (lose) {
			lose.loseContext();
		}

		return { webgl: true, software: SOFTWARE.test(name) };
	} catch {
		return { webgl: false, software: false };
	}
}

function get() {
	if (!capabilities) {
		capabilities = detect();
	}

	return capabilities;
}

export default function isWebGLAvailable() {
	return get().webgl;
}

export function isSoftwareRenderer() {
	return get().software;
}
