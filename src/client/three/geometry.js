import { BufferGeometry, BufferAttribute } from 'three';

// A hexagonal prism with a chamfered top edge, built by hand.
//
// ExtrudeGeometry would give the shape but not the UVs: the token art in public/img is a
// hexagonal chip drawn face on, and it has to land on the top face square, not tiled or turned.
// Generating it directly also buys a chamfer that catches the key light — which is most of what
// makes an extruded hexagon look machined rather than merely thick — and three material groups,
// so one mesh carries a textured face, a bright cut edge and a dark wall.
//
//   group 0  top face
//   group 1  chamfer     the bright ring; on a token it is the team's colour
//   group 2  wall        and the underside
//
// Flat shaded throughout, and it must stay that way: a smoothed hex prism reads as a cylinder at
// thirty pixels across and loses the hexagon entirely. Never call computeVertexNormals on these.

const FLAT_TOP = 0;
const POINTY_TOP = Math.PI / 6;

export const ORIENTATION = { flat: FLAT_TOP, pointy: POINTY_TOP };

function pusher(positions, normals, uvs) {
	return (x, y, z, nx, ny, nz, u, v) => {
		positions.push(x, y, z);
		normals.push(nx, ny, nz);
		uvs.push(u, v);

		return positions.length / 3 - 1;
	};
}

function build(positions, normals, uvs, groups) {
	const geometry = new BufferGeometry();
	const index = [];

	geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
	geometry.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
	geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));

	for (const [material, triangles] of groups.entries()) {
		if (triangles.length) {
			geometry.addGroup(index.length, triangles.length, material);
			index.push(...triangles);
		}
	}

	geometry.setIndex(index);
	geometry.computeBoundingSphere();

	return geometry;
}

/**
 * @param radius      centre to vertex
 * @param height      total, base to face
 * @param chamfer     how much of the radius the bevel eats
 * @param orientation ORIENTATION.flat puts vertices east and west, .pointy north and south
 */
export default function hexPrismGeometry({ radius, height, chamfer = radius * 0.12, orientation = FLAT_TOP }) {
	// The art is drawn to the hexagon's bounding box, so the face UVs use that box rather than the
	// circumradius — otherwise the icon would sit inside a border it never had.
	const corners = [0, 1, 2, 3, 4, 5].map(i => orientation + (i * Math.PI) / 3);
	const halfWidth = Math.max(...corners.map(angle => Math.abs(radius * Math.cos(angle))));
	const halfDepth = Math.max(...corners.map(angle => Math.abs(radius * Math.sin(angle))));

	const positions = [];
	const normals = [];
	const uvs = [];
	const face = [];
	const chamferBand = [];
	const wall = [];
	const push = pusher(positions, normals, uvs);

	const chamferY = height - chamfer;
	const faceUv = (x, z) => [x / (2 * halfWidth) + 0.5, 0.5 - z / (2 * halfDepth)];

	/**
	 * TOP FACE
	 */

	const centre = push(0, height, 0, 0, 1, 0, 0.5, 0.5);
	const faceRing = corners.map(angle => {
		const x = (radius - chamfer) * Math.cos(angle);
		const z = (radius - chamfer) * Math.sin(angle);

		return { index: push(x, height, z, 0, 1, 0, ...faceUv(x, z)), x, z };
	});

	for (let corner = 0; corner < 6; corner++) {
		face.push(centre, faceRing[(corner + 1) % 6].index, faceRing[corner].index);
	}

	/**
	 * CHAMFER AND WALL
	 */

	const bevelUp = Math.SQRT1_2;

	for (let corner = 0; corner < 6; corner++) {
		const from = corners[corner];
		const to = corners[(corner + 1) % 6];
		const mid = (from + to) / 2;

		const nx = Math.cos(mid);
		const nz = Math.sin(mid);

		const outerA = [radius * Math.cos(from), radius * Math.sin(from)];
		const outerB = [radius * Math.cos(to), radius * Math.sin(to)];
		const innerA = faceRing[corner];
		const innerB = faceRing[(corner + 1) % 6];

		const topA = push(innerA.x, height, innerA.z, nx * bevelUp, bevelUp, nz * bevelUp, 0, 1);
		const topB = push(innerB.x, height, innerB.z, nx * bevelUp, bevelUp, nz * bevelUp, 1, 1);
		const midA = push(outerA[0], chamferY, outerA[1], nx * bevelUp, bevelUp, nz * bevelUp, 0, 0);
		const midB = push(outerB[0], chamferY, outerB[1], nx * bevelUp, bevelUp, nz * bevelUp, 1, 0);

		chamferBand.push(topA, midB, midA, topA, topB, midB);

		const wallTopA = push(outerA[0], chamferY, outerA[1], nx, 0, nz, 0, 1);
		const wallTopB = push(outerB[0], chamferY, outerB[1], nx, 0, nz, 1, 1);
		const wallBottomA = push(outerA[0], 0, outerA[1], nx, 0, nz, 0, 0);
		const wallBottomB = push(outerB[0], 0, outerB[1], nx, 0, nz, 1, 0);

		wall.push(wallTopA, wallBottomB, wallBottomA, wallTopA, wallTopB, wallBottomB);
	}

	/**
	 * UNDERSIDE
	 */

	// Never seen — tiles are seated in a tray and tokens stand on tiles — but a closed solid is
	// cheaper to reason about than one that turns inside out at a grazing angle.
	const bottomCentre = push(0, 0, 0, 0, -1, 0, 0.5, 0.5);
	const bottomRing = corners.map(angle =>
		push(radius * Math.cos(angle), 0, radius * Math.sin(angle), 0, -1, 0, 0.5, 0.5),
	);

	for (let corner = 0; corner < 6; corner++) {
		wall.push(bottomCentre, bottomRing[corner], bottomRing[(corner + 1) % 6]);
	}

	return build(positions, normals, uvs, [face, chamferBand, wall]);
}

/**
 * The wedge on a token's nose.
 *
 * Facing is a core mechanic, and the art cannot carry it: only the agent's icon is an arrow. A
 * CEO is a person, a spy is a person in a hat, and a sniper is a radially symmetric crosshair, so
 * turning three of the four piece types communicates nothing at all — and turning the token's own
 * hexagon does not help either, because all six bearings are a multiple of 30 degrees off, which
 * leaves an identical silhouette every time. A wedge sticking out of one facet is readable at any
 * size, for a CEO exactly as well as for an agent.
 *
 * It points at local north, which the token's yaw then carries round to the bearing.
 */
export function prowGeometry({ inner, outer, baseHalf, tipHalf, bottom, top }) {
	const positions = [];
	const normals = [];
	const uvs = [];
	const triangles = [];
	const push = pusher(positions, normals, uvs);

	// Every quad is wound anticlockwise seen from the way its normal points, so the wedge is a
	// closed solid with no face inside out at a grazing angle.
	const face = (normal, ...points) => {
		const [a, b, c, d] = points.map(([x, y, z]) => push(x, y, z, ...normal, 0, 0));

		triangles.push(a, b, c, a, c, d);
	};

	// North is -z: the wedge runs out that way and narrows as it goes.
	const flank = Math.atan2(outer - inner, Math.max(baseHalf - tipHalf, 1e-6));
	const sideNormal = [Math.sin(flank), 0, -Math.cos(flank)];

	face([0, 1, 0], [-baseHalf, top, -inner], [baseHalf, top, -inner], [tipHalf, top, -outer], [-tipHalf, top, -outer]);

	face(
		[0, -1, 0],
		[-baseHalf, bottom, -inner],
		[-tipHalf, bottom, -outer],
		[tipHalf, bottom, -outer],
		[baseHalf, bottom, -inner],
	);

	face(
		[0, 0, -1],
		[-tipHalf, top, -outer],
		[tipHalf, top, -outer],
		[tipHalf, bottom, -outer],
		[-tipHalf, bottom, -outer],
	);

	face(
		[-sideNormal[0], 0, sideNormal[2]],
		[-baseHalf, top, -inner],
		[-tipHalf, top, -outer],
		[-tipHalf, bottom, -outer],
		[-baseHalf, bottom, -inner],
	);

	face(
		sideNormal,
		[baseHalf, top, -inner],
		[baseHalf, bottom, -inner],
		[tipHalf, bottom, -outer],
		[tipHalf, top, -outer],
	);

	// The back, where the wedge meets the barrel. It looks redundant and is not: the barrel is
	// chamfered away above chamferY, so at the top of the wedge there is nothing behind it and an
	// open back would show as a hole from a low angle.
	face(
		[0, 0, 1],
		[-baseHalf, top, -inner],
		[-baseHalf, bottom, -inner],
		[baseHalf, bottom, -inner],
		[baseHalf, top, -inner],
	);

	return build(positions, normals, uvs, [triangles]);
}
