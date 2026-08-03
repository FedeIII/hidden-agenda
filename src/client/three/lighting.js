import { AmbientLight, DirectionalLight, HemisphereLight } from 'three';

// Three lights, no shadow maps.
//
// A key from the front left so every chamfer on the board runs bright along one edge and dark
// along the other — that single highlight is what makes an extruded hexagon read as a solid
// rather than a coloured shape. A cool rim from behind separates dark tokens from a dark board,
// which is the whole problem with a team called black. The hemisphere fills the rest, tinted to
// the page's own #445873 so the board looks like it is standing in this room.
//
// The intensities are not free-hand. A diffuse surface facing the camera comes out at
// irradiance / PI times its own colour, and the four of these together have to add up to about PI
// for a colour to render as the colour it was written down as. They used to add up to a little
// over half of that, so every token was drawn at roughly 0.4 of its own artwork and the HQ racks
// at 0.45 of theirs — which is dim in a way that looks like a palette problem and is not one.
// Scale them together if the board wants to be brighter or darker; the ratios between them are the
// lighting, the sum is the exposure.

export default function addLights(scene, { key = 3.05, rim = 1, fill = 0.9, ambient = 0.62 } = {}) {
	const keyLight = new DirectionalLight('#fff3e0', key);
	keyLight.position.set(-6, 11, 6);

	const rimLight = new DirectionalLight('#8fc0ff', rim);
	rimLight.position.set(7, 5, -8);

	const sky = new HemisphereLight('#b9cee8', '#2c3646', fill);

	// Enough to keep an unlit underside from going pure black in tone mapping, no more.
	const ambientLight = new AmbientLight('#6f7f99', ambient);

	scene.add(keyLight, rimLight, sky, ambientLight);

	return { keyLight, rimLight, sky, ambient: ambientLight };
}
