import { AmbientLight, DirectionalLight, HemisphereLight } from 'three';

// Three lights, no shadow maps.
//
// A key from the front left so every chamfer on the board runs bright along one edge and dark
// along the other — that single highlight is what makes an extruded hexagon read as a solid
// rather than a coloured shape. A cool rim from behind separates dark tokens from a dark board,
// which is the whole problem with a team called black. The hemisphere fills the rest, tinted to
// the page's own #445873 so the board looks like it is standing in this room.

export default function addLights(scene, { key = 1.7, rim = 0.55, fill = 0.5 } = {}) {
	const keyLight = new DirectionalLight('#fff3e0', key);
	keyLight.position.set(-6, 11, 6);

	const rimLight = new DirectionalLight('#8fc0ff', rim);
	rimLight.position.set(7, 5, -8);

	const sky = new HemisphereLight('#b9cee8', '#2c3646', fill);

	// Enough to keep an unlit underside from going pure black in tone mapping, no more.
	const ambient = new AmbientLight('#6f7f99', 0.35);

	scene.add(keyLight, rimLight, sky, ambient);

	return { keyLight, rimLight, sky, ambient };
}
