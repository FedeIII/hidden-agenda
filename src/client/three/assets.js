import { CanvasTexture, LinearFilter, MeshStandardMaterial, SRGBColorSpace, TextureLoader } from 'three';
import { pz } from 'Domain/pieces';
import { artSrc } from 'Client/art';
import hexPrismGeometry, { ORIENTATION, prowGeometry } from './geometry';
import { SELECTED, TEAM, tileColors } from './palette';
import { R } from './layout';
import getStage from './stage';

// Everything shared between the five views. There is one renderer, so a geometry or a texture
// uploaded once serves the board and all four HQ trays.

// Tiles thick enough that the light down one chamfer and the shade down the other are the first
// thing you notice. Thin them and the board goes back to being coloured shapes on a page.
const TILE_RADIUS = R * 0.95;
const TILE_HEIGHT = R * 0.36;

// A token is nearly as wide as the tile it stands on, as it is in the flat game: the icon on its
// face is the piece's whole identity and it does not survive being made small.
const TOKEN_RADIUS = R * 0.74;
const TOKEN_HEIGHT = R * 0.34;

// The collar is WIDER than the barrel, which is the point of it — the overhang throws a hard dark
// line where a token meets its tile from every angle, so a white chip works on a pale tile and a
// black chip on a dark one without either needing to be relit.
const COLLAR_RADIUS = R * 0.78;
const COLLAR_HEIGHT = R * 0.055;

// How far the nose wedge reaches. Checked rather than chosen: a prow at 0.84R facing a
// neighbour's 0.78R collar comes to 1.62R against a 1.7321R column pitch, and two prows nose to
// nose come to 1.68R. Both clear. Do not raise it.
const PROW_REACH = R * 0.84;

export const SIZES = {
	tileRadius: TILE_RADIUS,
	tileHeight: TILE_HEIGHT,
	tokenRadius: TOKEN_RADIUS,
	tokenHeight: TOKEN_HEIGHT,
};

const cache = new Map();

function cached(key, build) {
	if (!cache.has(key)) {
		cache.set(key, build());
	}

	return cache.get(key);
}

export const getTileGeometry = () =>
	cached('tile', () =>
		hexPrismGeometry({
			radius: TILE_RADIUS,
			height: TILE_HEIGHT,
			chamfer: TILE_RADIUS * 0.14,
			orientation: ORIENTATION.pointy,
		}),
	);

// Flat topped, where the board is pointy topped — which is not a liberty, it is what the art
// does: every base sprite is wider than it is tall, with flat top and bottom edges and vertices
// east and west. A chip's flats face the cell's points, the way one sits in a socket.
export const getTokenGeometry = () =>
	cached('token', () =>
		hexPrismGeometry({
			radius: TOKEN_RADIUS,
			height: TOKEN_HEIGHT,
			chamfer: TOKEN_RADIUS * 0.16,
			orientation: ORIENTATION.flat,
		}),
	);

export const getCollarGeometry = () =>
	cached('collar', () =>
		hexPrismGeometry({
			radius: COLLAR_RADIUS,
			height: COLLAR_HEIGHT,
			chamfer: COLLAR_RADIUS * 0.1,
			orientation: ORIENTATION.flat,
		}),
	);

export const getProwGeometry = () =>
	cached('prow', () =>
		prowGeometry({
			// Starts at the barrel's own inradius, so it grows out of the facet rather than
			// hovering in front of it.
			inner: TOKEN_RADIUS * Math.cos(Math.PI / 6),
			outer: PROW_REACH,
			baseHalf: R * 0.13,
			tipHalf: R * 0.028,
			bottom: R * 0.13,
			top: TOKEN_HEIGHT - R * 0.06,
		}),
	);

/**
 * TEXTURES
 */

const loader = new TextureLoader();

// The same PNG the flat renderer draws, on the top face of the prism. Reusing the art rather than
// redrawing the icons in geometry is the difference between a 3D version of this game and a
// different game that happens to share its rules.
function getFaceTexture(team, type) {
	return cached(`face-${team}-${type}`, () => {
		const texture = loader.load(
			artSrc(team, type),
			() => {
				const stage = getStage();

				if (stage) {
					stage.invalidateAll();
				}
			},
			undefined,
			// A missing texture must never throw: an uncaught error here would take down whatever
			// else the page happens to be doing.
			() => {},
		);

		texture.colorSpace = SRGBColorSpace;
		texture.anisotropy = 4;

		return texture;
	});
}

// A soft radial fade, drawn once at 64px and reused for every contact shadow and every CEO halo.
// Shadow maps are the most expensive thing a scene this small could ask for, and the suite renders
// through a software rasteriser, so the one shadow that actually sells a token as sitting on a
// tile is painted rather than cast.
//
// White, not black. A MeshBasicMaterial multiplies its colour by the texel, so a gradient painted
// over black can only ever come out black however it is tinted — which is how the CEO buff's warm
// halo spent a while being a second, wider shadow. The shadow tints this black itself.
export const getFadeTexture = () =>
	cached('fade', () => {
		const canvas = document.createElement('canvas');
		canvas.width = 64;
		canvas.height = 64;

		const context = canvas.getContext('2d');
		const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);

		gradient.addColorStop(0, 'rgba(255,255,255,0.55)');
		gradient.addColorStop(0.55, 'rgba(255,255,255,0.28)');
		gradient.addColorStop(1, 'rgba(255,255,255,0)');

		context.fillStyle = gradient;
		context.fillRect(0, 0, 64, 64);

		const texture = new CanvasTexture(canvas);
		texture.colorSpace = SRGBColorSpace;
		texture.minFilter = LinearFilter;

		return texture;
	});

/**
 * MATERIALS
 */

// A word about metalness, because it is not the dial it looks like.
//
// There is no environment map in this scene and there is not going to be one — an irradiance cube
// is a texture fetch per fragment in a renderer that is fill-bound and runs through SwiftShader in
// the test suite. But metalness is a claim about reflecting the surroundings: it scales a surface's
// diffuse by (1 - metalness) and hands what it took to a specular term that here has nothing but
// two directional lights to reflect. So with no environment, metalness is very nearly pure
// subtraction. It is what took the HQ racks down to 0.45 of their own colour and the token barrels
// below half of theirs, all of it looking like the palette was too dark when the palette was fine.
//
// A little still earns its keep on a chamfer, where the two lights it does have to work with are
// exactly the ones that draw the bright edge. Past about 0.4 it is just a darker colour written
// the long way round.

// One set per distinct shade rather than per cell: the board's quiet chequer only has five levels
// in it, so thirty-seven tiles share five sets of three.
export function getTileMaterials(row, cell) {
	const colors = tileColors(row, cell);

	return cached(`tile-${colors.face}`, () => [
		new MeshStandardMaterial({ color: colors.face, roughness: 0.68, metalness: 0.05 }),
		new MeshStandardMaterial({ color: colors.chamfer, roughness: 0.3, metalness: 0.22 }),
		new MeshStandardMaterial({ color: colors.wall, roughness: 0.55, metalness: 0.14 }),
	]);
}

export const getCollarMaterial = team =>
	cached(
		`collar-${team}`,
		() => new MeshStandardMaterial({ color: TEAM[team].collar, roughness: 0.5, metalness: 0.18 }),
	);

// The face never changes, so every agent of a team shares one. The chamfer cannot: selection and
// a lit sniper both speak through its emissive, and both are per piece. So each token gets its
// own copy of that one material — thirty-two of them, which is nothing.
export function createTokenMaterials(pieceId) {
	const team = pz.getTeam(pieceId);
	const type = pz.getType(pieceId);

	// The face carries the artwork, so it gets as close to unmodified as a lit surface can: the
	// point of reusing the PNG is that a token looks like the piece the flat game drew.
	const face = cached(
		`faceMaterial-${team}-${type}`,
		() =>
			new MeshStandardMaterial({
				map: getFaceTexture(team, type),
				roughness: 0.45,
				metalness: 0.04,
			}),
	);

	const chamfer = new MeshStandardMaterial({
		color: TEAM[team].rim,
		roughness: 0.28,
		metalness: 0.4,
		emissive: SELECTED,
		emissiveIntensity: 0,
	});

	const wall = new MeshStandardMaterial({ color: TEAM[team].body, roughness: 0.34, metalness: 0.2 });

	return { face, chamfer, wall };
}
