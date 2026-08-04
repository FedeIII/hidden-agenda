import { test, expect } from './fixtures';

// The 3D board is a skin over the same DOM the flat one used: the hexagons and pieces are still
// there, still clickable, still asserted against — they have simply gone transparent and moved
// onto the projection of the tiles the renderer draws.
//
// That arrangement has two failure modes the rest of the suite cannot see. It could silently not
// be running at all, in which case every other spec would pass while testing the renderer this
// change replaced; and the invisible boxes could drift off the tiles they belong to, in which
// case clicks would land on the wrong cell and the game would be subtly, unreproducibly wrong.
// Both are covered here.

// Off-screen points have no element under them, so a hexagon scrolled below the fold cannot be
// asked this question. There are more than enough that are not.
const MINIMUM_CHECKED = 40;

async function whatIsUnderTheMiddleOf(page, selector) {
	return page.evaluate(sel => {
		const wrong = [];
		let checked = 0;

		for (const element of document.querySelectorAll(sel)) {
			const box = element.getBoundingClientRect();
			const x = box.left + box.width / 2;
			const y = box.top + box.height / 2;

			if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) {
				continue;
			}

			checked++;

			const hit = document.elementFromPoint(x, y);
			// A piece is a child of its hexagon, so either the piece itself or its cell counts as
			// the right answer for a cell — that is exactly how the flat board behaves.
			const owner = hit && hit.closest(sel);

			if (!owner || owner.id !== element.id) {
				wrong.push(`${element.id} -> ${(owner && owner.id) || (hit && hit.id) || 'nothing'}`);
			}
		}

		return { wrong, checked };
	}, selector);
}

// Presses, crosses the drag threshold, travels, and counts the drag images on the page before
// letting go — the DragProvider's ghost is the only aria-hidden img the app ever renders.
async function ghostsWhileDragging(page, from, to) {
	const start = await page.locator(from).boundingBox();
	const end = await page.locator(to).boundingBox();

	await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
	await page.mouse.down();
	await page.mouse.move(start.x + start.width / 2 + 12, start.y + start.height / 2 + 12);
	await page.mouse.move(end.x + end.width / 2, end.y + end.height / 2);

	const ghosts = await page.locator('img[aria-hidden="true"]').count();

	await page.mouse.up();

	return ghosts;
}

// What the player can actually see at a point on the page.
//
// Everything else in this suite asks the DOM a question, because everything else in this suite is
// the DOM. The renderer's output is not: it is one canvas with nothing inside it to interrogate, so
// a pixel is the only thing there is to assert against. The screenshot has to go back into the
// browser to be read, because nothing on this side can decode a PNG.
async function coloursAt(page, points) {
	const encoded = (await page.screenshot()).toString('base64');

	return page.evaluate(
		([data, at]) =>
			new Promise((resolve, reject) => {
				const image = new Image();

				image.onload = () => {
					const canvas = document.createElement('canvas');
					canvas.width = image.width;
					canvas.height = image.height;

					const context = canvas.getContext('2d');
					context.drawImage(image, 0, 0);

					// The shot is in device pixels; the points came from getBoundingClientRect and are
					// in CSS pixels.
					const scale = image.width / window.innerWidth;

					resolve(
						at.map(([x, y]) => {
							const pixel = context.getImageData(Math.round(x * scale), Math.round(y * scale), 1, 1).data;

							return [pixel[0], pixel[1], pixel[2]];
						}),
					);
				};
				image.onerror = () => reject(new Error('the screenshot did not decode'));

				image.src = `data:image/png;base64,${data}`;
			}),
		[encoded, points],
	);
}

test.describe('3D BOARD', () => {
	test('is actually being rendered', async ({ page, goToPlay }) => {
		await goToPlay(2);

		// Without this the suite could go green having tested the flat renderer the whole time.
		const stage = await page.locator('#three-stage').evaluate(canvas => {
			const context = canvas.getContext('webgl2');

			return { width: context.drawingBufferWidth, height: context.drawingBufferHeight, lost: context.isContextLost() };
		});

		expect(stage.lost).toBe(false);
		expect(stage.width).toBeGreaterThan(0);
		expect(stage.height).toBeGreaterThan(0);

		// And that the DOM went transparent rather than merely sitting on top of it.
		const hexagon = await page
			.locator('#hex-3-3')
			.evaluate(cell => ({ opacity: getComputedStyle(cell).opacity, position: getComputedStyle(cell).position }));

		expect(hexagon.opacity).toEqual('0');
		expect(hexagon.position).toEqual('absolute');
	});

	test('every cell is clickable exactly where it is drawn', async ({ page, goToPlay }) => {
		await goToPlay(2);

		// The hexagons tile the board with no gaps, so a click anywhere on it belongs to exactly
		// one cell — and in particular the middle of a cell belongs to that cell. Get this wrong
		// and a click lands on the row below, which no other spec would explain.
		const { wrong, checked } = await whatIsUnderTheMiddleOf(page, '[id^="hex-"]');

		expect(wrong).toEqual([]);
		expect(checked).toBeGreaterThan(MINIMUM_CHECKED);
	});

	test('every piece in every HQ is clickable exactly where it is drawn', async ({ page, goToPlay }) => {
		await goToPlay(2);

		// This is why the browser specs are pinned to 800x600: where the pieces sit in an HQ is
		// what decides which one a click lands on.
		const { wrong, checked } = await whatIsUnderTheMiddleOf(page, '[id^="pz-"]');

		expect(wrong).toEqual([]);
		expect(checked).toEqual(32);
	});

	test('a piece dropped on a cell lands on the cell it was dropped on', async ({ drag, get, goToPlay }) => {
		await goToPlay(2);

		// Dragging resolves the cell under the pointer with elementFromPoint, so it goes through
		// the projected boxes rather than through any coordinate the renderer knows about.
		await drag.fromTo('#pz-0-A1', '#hex-2-2');

		expect(await get.pieceIn(2, 2).id).toEqual('pz-0-A1');
	});

	test('carries the piece itself rather than a picture of it', async ({ page, goToPlay }) => {
		await goToPlay(2);

		// The flat renderer drags an <img> around under the pointer. With a renderer that can pick
		// the actual piece up and carry it, that ghost is not merely redundant, it is a second copy
		// of the thing being dragged.
		expect(await ghostsWhileDragging(page, '#pz-0-A1', '#hex-2-2')).toEqual(0);
	});

	test('draws a carried piece over the tray it came out of', async ({ page, goToPlay }) => {
		await goToPlay(2);

		const held = await page.locator('#pz-0-A1').boundingBox();
		// Another socket in the same HQ. It is outside the board's own rectangle, and the board is
		// the only view that can draw a piece in flight — an HQ tray and the board are separate
		// views with separate cameras and neither can paint into the other's box.
		const socket = await page.locator('#pz-0-N').boundingBox();
		const point = [socket.x + socket.width / 2, socket.y + socket.height / 2];

		const [before] = await coloursAt(page, [point]);

		await page.mouse.move(held.x + held.width / 2, held.y + held.height / 2);
		await page.mouse.down();
		await page.mouse.move(held.x + held.width / 2 + 12, held.y + held.height / 2 + 12);
		await page.mouse.move(point[0], point[1]);
		// Long enough for a frame to be drawn with the piece where the pointer now is.
		await page.waitForTimeout(300);

		const [after] = await coloursAt(page, [point]);

		await page.mouse.up();

		// Opening the scissor is not enough on its own and this is the spec that says so: the
		// viewport is a hard edge, WebGL clips a primitive to it whatever the scissor allows, and
		// this pixel stayed exactly the colour of the sniper in its socket while the piece the
		// player was holding was nowhere on screen at all.
		const moved = Math.max(...[0, 1, 2].map(channel => Math.abs(after[channel] - before[channel])));

		expect(moved).toBeGreaterThan(24);
	});

	test('lights the board rather than dimming it', async ({ page, goToPlay }) => {
		await goToPlay(2);

		// Row 3 cell 2 is one of the cells the chequer does not darken at all, so its top face is
		// #a1abb7 — the exact grey the flat board has always used and where the 3D palette took it
		// from. Nothing is selected, so nothing is tinting it.
		const cell = await page.locator('#hex-3-2').boundingBox();
		const [[red, green, blue]] = await coloursAt(page, [[cell.x + cell.width / 2, cell.y + cell.height / 2]]);

		// Lit, not dimmed. The lights in lighting.js have to sum to about PI for a colour to render
		// as the colour it was written down as; they summed to a little over half of that once, and
		// every tile, token and HQ rack came out at roughly half its own value while the palette
		// said otherwise. Metalness with no environment map does the same thing more quietly.
		expect(red).toBeGreaterThan(0.85 * 0xa1);
		expect(green).toBeGreaterThan(0.85 * 0xab);
		expect(blue).toBeGreaterThan(0.85 * 0xb7);

		// And a surface, not a light: the tile must not be blowing past its own albedo either.
		expect(red).toBeLessThan(0xa1 + 12);
	});
});

test.describe('WITHOUT WEBGL', () => {
	// Nothing about the game depends on the renderer, so a browser that will not give us a context
	// gets the board the game shipped with rather than a blank rectangle. ?flat is the same path a
	// lost context takes.
	test.beforeEach(async ({ page }) => {
		await page.goto('/?flat&skin=dossier&hotseat');
	});

	test('falls back to the flat board', async ({ page, goToPlay }) => {
		await goToPlay(2);

		await expect(page.locator('#three-stage')).toHaveCount(0);

		const hexagon = await page
			.locator('#hex-3-3')
			.evaluate(cell => ({ opacity: getComputedStyle(cell).opacity, position: getComputedStyle(cell).position }));

		expect(hexagon.opacity).toEqual('1');
		expect(hexagon.position).toEqual('relative');
	});

	test('still drags with a picture of the piece', async ({ page, goToPlay }) => {
		await goToPlay(2);

		// Nothing can be carried when nothing is being rendered, so the flat renderer keeps the
		// ghost it always had — and dragging keeps working exactly as it did.
		expect(await ghostsWhileDragging(page, '#pz-0-A1', '#hex-2-2')).toEqual(1);
	});

	test('is still playable', async ({ page, clickOn, get, goToPlay }) => {
		await goToPlay(2);

		await clickOn.team(0).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);

		expect(await get.pieceIn(1, 1).id).toEqual('pz-0-A1');
		expect(await get.nextTurn.isActive).toBe(true);

		await page.click('#next-turn');
		await expect(page.locator('#turn-player')).toHaveText('SARA');
	});
});
