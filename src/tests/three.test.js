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
});

test.describe('WITHOUT WEBGL', () => {
	// Nothing about the game depends on the renderer, so a browser that will not give us a context
	// gets the board the game shipped with rather than a blank rectangle. ?flat is the same path a
	// lost context takes.
	test.beforeEach(async ({ page }) => {
		await page.goto('/?flat');
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

	test('is still playable', async ({ page, clickOn, get, goToPlay }) => {
		await goToPlay(2);

		await clickOn.team(0).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);

		expect(await get.pieceIn(1, 1).id).toEqual('pz-0-A1');
		expect(await get.nextTurn.isActive).toBe(true);

		await page.click('#next-turn');
		await expect(page.locator('.game')).toContainText("Player's turn: SARA");
	});
});
