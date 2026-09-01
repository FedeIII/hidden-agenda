// Whether the player has asked their system for less movement.
//
// This lived in `three/stage.js`, where it was first needed, and it is here now because it stopped
// being the renderer's question: the turn strip asks it too, and a DOM component that has to import
// the WebGL stage to find out is a component that drags `three` into whatever reads it.
//
// One definition, wherever it is asked from — `three/stage.js` re-exports this rather than keeping a
// second copy, because a box where half the app animates and half does not is worse than either.
export function prefersReducedMotion() {
	return (
		typeof window !== 'undefined' &&
		!!window.matchMedia &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches
	);
}

export default prefersReducedMotion;
