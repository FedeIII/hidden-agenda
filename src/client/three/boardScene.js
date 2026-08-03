import { Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, RingGeometry, Scene, Vector3 } from 'three';
import { pz } from 'Domain/pieces';
import { getTileGeometry, getTileMaterials, SIZES } from './assets';
import hexPrismGeometry, { ORIENTATION } from './geometry';
import addLights from './lighting';
import { allRenderedCells, cellToWorld, COLUMN_PITCH, directionToAngle, isPlayableCell, R, ROW_PITCH } from './layout';
import { AIM, BOARD, HIGHLIGHT, HOVER, KEYLINE } from './palette';
import { prefersReducedMotion } from './stage';
import createProjector, { boxStyle } from './view';
import createToken from './token';

// The board: a hexagonal tray with thirty-seven tiles inlaid in it, twenty-four ghost cells
// around the edge that exist only to be pointed at, and the pieces standing on top.
//
// The tray really is a hexagon — rows of 4,5,6,7,6,5,4 make one, with points east and west and
// flat edges north and south — which is a nicer thing to discover than to design.

const TILE_TOP = SIZES.tileHeight;

// Legal cells stand up out of the tray like buttons. Y only, and small: it is the best tabletop
// reading of "you may go here", and being vertical it cannot move a single overlay box.
const TILE_RISE = R * 0.05;
const RISE_RATE = 18;

// Sized so the lip is about the same all the way round. The board's outline is already a
// flat-topped hexagon, so the tray is the same hexagon, larger. Its half-height is only 0.866 of
// its radius, hence solving for the taller of the two constraints rather than adding a margin to
// the wider one.
const PLINTH_RADIUS = (3 * ROW_PITCH + SIZES.tileRadius + R * 0.45) / Math.cos(Math.PI / 6);
const PLINTH_DEPTH = R * 0.75;

const shared = {};

function sharedAsset(key, build) {
	if (!shared[key]) {
		shared[key] = build();
	}

	return shared[key];
}

// A hexagonal annulus, pointy topped to sit square on a cell. RingGeometry lays out in XY from
// the +x axis, so it starts a quarter turn round and is then laid flat.
function hexRing(inner, outer) {
	const geometry = new RingGeometry(inner, outer, 6, 1, Math.PI / 2);
	geometry.rotateX(-Math.PI / 2);

	return geometry;
}

function flat(key, inner, outer, color, opacity) {
	return new Mesh(
		sharedAsset(`ring-${key}`, () => hexRing(inner, outer)),
		sharedAsset(
			`ringMaterial-${key}`,
			() => new MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false }),
		),
	);
}

function createPlinth() {
	const plinth = new Mesh(
		sharedAsset('plinth', () =>
			hexPrismGeometry({
				radius: PLINTH_RADIUS,
				height: PLINTH_DEPTH,
				chamfer: R * 0.3,
				orientation: ORIENTATION.flat,
			}),
		),
		sharedAsset('plinthMaterials', () => [
			new MeshStandardMaterial({ color: BOARD.plinth, roughness: 0.85, metalness: 0.15 }),
			new MeshStandardMaterial({ color: BOARD.plinthEdge, roughness: 0.4, metalness: 0.6 }),
			new MeshStandardMaterial({ color: BOARD.plinth, roughness: 0.85, metalness: 0.15 }),
		]),
	);

	plinth.position.y = -PLINTH_DEPTH;

	return plinth;
}

// Legal destinations are red on the flat board and stay red here. A rim and a wash rather than a
// solid fill: the tile underneath has to stay readable, because a legal cell is very often the
// cell a player is also trying to see a piece on. The dark shoulder outside the red is what makes
// one ring work on the palest tile and the darkest alike — red on #a1abb7 is about 1.5:1 on its
// own, which is not a signal.
function createHighlight() {
	const group = new Group();

	const wash = flat('wash', 0, SIZES.tileRadius * 0.84, HIGHLIGHT, 0.18);
	const rim = flat('rim', SIZES.tileRadius * 0.855, SIZES.tileRadius * 0.9, HIGHLIGHT, 0.95);
	const keyline = flat('keyline', SIZES.tileRadius * 0.9, SIZES.tileRadius * 0.912, KEYLINE, 0.85);

	wash.position.y = TILE_TOP + 0.006;
	rim.position.y = TILE_TOP + 0.008;
	keyline.position.y = TILE_TOP + 0.008;
	wash.renderOrder = 1;
	rim.renderOrder = 2;
	keyline.renderOrder = 3;

	group.add(wash, rim, keyline);
	group.visible = false;

	return group;
}

// Where a piece may be POINTED, which is never the same colour as where it may go. Six of them,
// reused: a piece only ever aims from one cell at a time.
const AIM_MARKERS = 6;

function createAimMarker() {
	const marker = flat('aim', SIZES.tileRadius * 0.66, SIZES.tileRadius * 0.86, AIM, 0.62);

	marker.renderOrder = 2;
	marker.visible = false;

	return marker;
}

export default function createBoardScene() {
	const scene = new Scene();

	addLights(scene);
	scene.add(createPlinth());

	const cells = allRenderedCells();
	const tiles = new Map();
	const highlights = new Map();

	for (const cell of cells) {
		if (!cell.playable) {
			// The ring past the edge is not a place, it is somewhere to point at, and it hangs off
			// the side of the tray with nothing underneath it. Drawing anything there at rest reads
			// as a mistake rather than as a hint — the flat board draws nothing either. It gets its
			// moment when a piece is actually being aimed, as one of the aim markers below.
			continue;
		}

		const tile = new Mesh(getTileGeometry(), getTileMaterials(cell.row, cell.cell));
		tile.position.set(cell.x, 0, cell.z);

		// Parented to the tile, so a legal cell's ring rises with the tile it belongs to instead
		// of being left behind on the tray.
		const highlight = createHighlight();
		tile.add(highlight);

		scene.add(tile);
		tiles.set(`${cell.row}-${cell.cell}`, { tile, rise: 0, wanted: 0 });
		highlights.set(`${cell.row}-${cell.cell}`, highlight);
	}

	// Row 3 cell 3 is the only cell the flat board paints with a radial gradient where every other
	// cell is linear. It keeps a mark of its own: a brass boss set into the tile — an inlay, not a
	// light, so a legal-move ring on that cell still wins the eye.
	const centreMark = new Mesh(
		sharedAsset('centreGeometry', () => hexRing(SIZES.tileRadius * 0.14, SIZES.tileRadius * 0.3)),
		sharedAsset(
			'centreMaterial',
			() => new MeshStandardMaterial({ color: BOARD.centre, roughness: 0.35, metalness: 0.8 }),
		),
	);
	// Parented to its tile rather than placed in world space, so it rides up with the tile when
	// row 3 cell 3 is a legal destination instead of being left behind inside it.
	centreMark.position.set(0, TILE_TOP + 0.004, 0);
	tiles.get('3-3').tile.add(centreMark);

	// The flat board lightened the cell under the pointer by five percent. Cheap, and the only
	// thing that ever said which of thirty-seven near-identical hexagons the pointer owned — so it
	// comes back here as a thin cool rim, kept clear of red (may go) and blue (may point).
	const hoverRing = flat('hover', SIZES.tileRadius * 0.9, SIZES.tileRadius * 0.99, HOVER, 0.5);
	hoverRing.position.y = TILE_TOP + 0.01;
	hoverRing.renderOrder = 1;
	hoverRing.visible = false;

	const aimMarkers = [];
	for (let marker = 0; marker < AIM_MARKERS; marker++) {
		const mesh = createAimMarker();

		aimMarkers.push(mesh);
		scene.add(mesh);
	}

	// Bounds deliberately include the ring past the edge. Those cells are clickable, and a
	// clickable box that escaped its container would sit invisibly over an HQ button.
	// Both corners at BOTH heights. A point higher up is a point nearer a camera looking down at
	// 52 degrees, so it projects further out — bounding the box at the tray and the tile top
	// separately would let an overlay box escape the container the fit was supposed to keep it in.
	const bounds = [];
	for (const cell of cells) {
		for (const y of [0, TILE_TOP]) {
			bounds.push(
				new Vector3(cell.x - COLUMN_PITCH / 2, y, cell.z - ROW_PITCH / 2),
				new Vector3(cell.x + COLUMN_PITCH / 2, y, cell.z + ROW_PITCH / 2),
			);
		}
	}

	const projector = createProjector({ bounds, padding: 0.02 });
	const tokens = new Map();
	// Which cell each token is standing on, so it can ride up with a tile that rises under it.
	const standingOn = new Map();
	let signature = null;

	// Pieces stand on the tiles, not in them. One group carries the lot up to the tile surface so
	// a token never has to know how thick the board it is standing on happens to be.
	const standing = new Group();
	standing.position.y = TILE_TOP;
	scene.add(standing, hoverRing);

	function tokenFor(pieceId) {
		if (!tokens.has(pieceId)) {
			const token = createToken(pieceId);

			tokens.set(pieceId, token);
			standing.add(token.object);
		}

		return tokens.get(pieceId);
	}

	return {
		scene,
		camera: projector.camera,

		resize(width, height) {
			projector.resize(width, height);
		},

		extent: projector.extent,

		/**
		 * Where each cell's invisible DOM twin has to go, ready to hand to an element's `style`.
		 *
		 * Boxes are a column pitch wide and a row pitch tall, which tiles the plane exactly: a
		 * cell's right edge is its neighbour's left edge to the pixel, and its bottom edge is the
		 * next row's top edge. Using the hexagons' own bounding boxes instead would overlap
		 * adjacent rows by a quarter of their height, and which of two invisible boxes a click
		 * landed on would come down to DOM order.
		 */
		layout() {
			const boxes = {};

			for (const cell of cells) {
				boxes[`${cell.row}-${cell.cell}`] = boxStyle(
					projector,
					cell.x,
					cell.z,
					TILE_TOP,
					COLUMN_PITCH / 2,
					ROW_PITCH / 2,
				);
			}

			return boxes;
		},

		/** @returns whether anything visible changed, which decides whether the board repaints. */
		setState({ pieces, highlightedPositions, snipe, aim, hovered }) {
			const next = [
				pieces
					.filter(piece => piece.position && !piece.killed)
					.map(
						piece =>
							`${piece.id}@${piece.position}/${piece.selectedDirection}${piece.selected ? 's' : ''}${
								piece.highlight ? 'h' : ''
							}${piece.buffed ? 'b' : ''}`,
					)
					.join(),
				highlightedPositions.join(';'),
				snipe ? 'snipe' : '',
				aim ? `${aim.from}>${aim.directions.join(';')}` : '',
			].join('|');

			if (next === signature) {
				return false;
			}

			signature = next;

			for (const highlight of highlights.values()) {
				highlight.visible = false;
			}
			for (const entry of tiles.values()) {
				entry.wanted = 0;
			}

			for (const [row, cell] of highlightedPositions) {
				const key = `${row}-${cell}`;
				const highlight = highlights.get(key);

				if (highlight) {
					highlight.visible = true;
					tiles.get(key).wanted = TILE_RISE;
				}
			}

			// Aim markers are placed by world offset rather than by cell, because half of them
			// land on the ring past the edge — which has no coordinates the domain will hand back.
			for (const marker of aimMarkers) {
				marker.visible = false;
			}

			if (aim) {
				const from = cellToWorld(aim.from[0], aim.from[1]);

				aim.directions.slice(0, AIM_MARKERS).forEach((direction, at) => {
					const bearing = (directionToAngle(direction) * Math.PI) / 180;
					const marker = aimMarkers[at];

					marker.position.set(
						from.x + COLUMN_PITCH * Math.sin(bearing),
						TILE_TOP + 0.01,
						from.z - COLUMN_PITCH * Math.cos(bearing),
					);
					marker.visible = true;
				});
			}

			const under = hovered && tiles.get(`${hovered[0]}-${hovered[1]}`);

			hoverRing.visible = !!under;
			if (under) {
				const at = cellToWorld(hovered[0], hovered[1]);

				hoverRing.position.set(at.x, TILE_TOP + 0.01, at.z);
			}

			const onBoard = new Set();

			for (const piece of pieces) {
				if (piece.killed || !piece.position || !isPlayableCell(piece.position[0], piece.position[1])) {
					continue;
				}

				const { x, z } = cellToWorld(piece.position[0], piece.position[1]);
				const token = tokenFor(piece.id);

				onBoard.add(piece.id);
				standingOn.set(piece.id, `${piece.position[0]}-${piece.position[1]}`);
				token.set({
					x,
					z,
					direction: piece.selectedDirection,
					selected: piece.selected,
					// A lit sniper is the other half of a snipe, and the only piece the flat board
					// brightens for a reason that is not selection.
					snipe: !!snipe && piece.highlight && pz.isSniper(piece.id),
					buffed: piece.buffed,
				});
			}

			// A piece that left the board was killed, or was rolled back by a sniper. Either way
			// it stops existing here rather than sliding off.
			for (const [pieceId, token] of tokens) {
				if (!onBoard.has(pieceId)) {
					standing.remove(token.object);
					token.dispose();
					tokens.delete(pieceId);
					standingOn.delete(pieceId);
				}
			}

			return true;
		},

		update(delta) {
			let animating = false;

			const snap = prefersReducedMotion();

			for (const entry of tiles.values()) {
				if (!snap && Math.abs(entry.rise - entry.wanted) > TILE_RISE * 0.02) {
					entry.rise += (entry.wanted - entry.rise) * (1 - Math.exp(-RISE_RATE * delta));
					animating = true;
				} else {
					entry.rise = entry.wanted;
				}

				entry.tile.position.y = entry.rise;
			}

			for (const [pieceId, token] of tokens) {
				if (token.update(delta)) {
					animating = true;
				}

				// After update, which puts the token back on the tray's surface. A legal cell is
				// often an occupied one — that is how an agent kills — so the piece standing there
				// has to come up with the tile rather than be left half sunk in it.
				const tile = tiles.get(standingOn.get(pieceId));
				token.object.position.y = tile ? tile.rise : 0;
			}

			return animating;
		},

		dispose() {
			for (const token of tokens.values()) {
				token.dispose();
			}
			tokens.clear();
		},
	};
}
