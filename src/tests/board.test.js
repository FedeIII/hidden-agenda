import { test, expect } from './fixtures';

test.describe('BOARD', () => {
	test.beforeEach(async ({ goToPlay }) => {
		await goToPlay(2);
	});

	// Regression: pz.isTogglePieceOnCellClick used to return true with nothing selected, and
	// the caller then read selectedPiece.id on undefined. The failOnPageError fixture is what
	// actually catches the throw; the assertions confirm the click stays a no-op.
	test('ignores a click on an empty cell when no piece is selected', async ({ clickOn, get }) => {
		await clickOn.cell(3, 3);

		expect(await get.cell(3, 3).isEmpty).toBe(true);
	});

	test('ignores a click on an occupied cell when no piece is selected', async ({ page, clickOn, get }) => {
		await clickOn.team(0).agent(1);
		await clickOn.cell(3, 3);
		await clickOn.cell(4, 3);
		await page.click('#next-turn');

		// A1 is on the board and nothing is selected now.
		await clickOn.cell(3, 3);

		expect(await get.pieceIn(3, 3).id).toEqual('pz-0-A1');
	});
});

// Dragging is our own pointer-event code now rather than react-dnd, so it needs its own cover.
test.describe('DRAGGING', () => {
	test.beforeEach(async ({ goToPlay }) => {
		await goToPlay(2);
	});

	test('places a piece dragged out of the HQ onto a cell', async ({ drag, get }) => {
		await drag.fromTo('#pz-0-A1', '#hex-1-1');

		expect(await get.pieceIn(1, 1).id).toEqual('pz-0-A1');
	});

	test('moves a piece dragged to a legal cell', async ({ page, clickOn, drag, get }) => {
		await clickOn.team(0).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);
		await page.click('#next-turn');

		// Two cells ahead of an agent facing down-right, so the drop lands on a legal cell.
		await drag.fromTo('#pz-0-A1', '#hex-3-3');

		expect(await get.pieceIn(3, 3).id).toEqual('pz-0-A1');
		expect(await get.cell(1, 1).isEmpty).toBe(true);
	});

	test('leaves a piece put down on an illegal cell where it was', async ({ page, clickOn, drag, get }) => {
		await clickOn.team(0).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);
		await page.click('#next-turn');

		// Behind the agent, so not a legal destination.
		await drag.fromTo('#pz-0-A1', '#hex-0-0');

		expect(await get.pieceIn(1, 1).id).toEqual('pz-0-A1');
	});

	test('treats a press with no movement as a plain selection', async ({ drag, get }) => {
		await drag.pressWithoutMoving('#pz-0-A1');

		expect(await get.team(0).agent(1).isHighlighted).toBe(true);
	});

	test('places a piece dragged by touch, which HTML5 drag-and-drop could never do', async ({ drag, get }) => {
		await drag.byTouchFromTo('#pz-0-A1', '#hex-1-1');

		expect(await get.pieceIn(1, 1).id).toEqual('pz-0-A1');
	});
});

// Everybody moves everybody's pieces here, so which of 32 tokens has just changed is the one thing
// a player arriving at their turn cannot read off the board. A tag over one cell says it.
test.describe('THE LAST MOVE', () => {
	test.beforeEach(async ({ goToPlay }) => {
		await goToPlay(2);
	});

	async function anAgentPutDownOnACell(page, clickOn) {
		await clickOn.team(0).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);
	}

	test('says nothing until the turn is handed on', async ({ page, clickOn }) => {
		await anAgentPutDownOnACell(page, clickOn);

		// Absent rather than empty, like the fallen sniper's mark: a spec asserting nothing is
		// there is then asserting the rule and not a blank string.
		await expect(page.locator('#last-move-0-A1')).toHaveCount(0);

		await page.click('#next-turn');

		await expect(page.locator('#last-move-0-A1')).toBeVisible();
		await expect(page.locator('#last-move-0-A1')).toHaveText('LAST MOVE');
	});

	test('sits on the cell the move ended on', async ({ page, clickOn }) => {
		await anAgentPutDownOnACell(page, clickOn);
		await page.click('#next-turn');

		const mark = await page.locator('#last-move-0-A1').boundingBox();
		const cell = await page.locator('#hex-1-1').boundingBox();

		expect(Math.round(mark.x)).toEqual(Math.round(cell.x));
		expect(Math.round(mark.y)).toEqual(Math.round(cell.y));
		expect(Math.round(mark.width)).toEqual(Math.round(cell.width));
	});

	// pointer-events: none, for the reason the training coach marks have it — the cell underneath
	// is an ordinary one and a box laid over it would quietly eat every click on the piece there.
	test('does not take the click on the cell it marks', async ({ page, clickOn, get }) => {
		await anAgentPutDownOnACell(page, clickOn);
		await page.click('#next-turn');

		const under = await page.evaluate(() => {
			const box = document.querySelector('#last-move-0-A1').getBoundingClientRect();
			const at = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);

			return at && at.id;
		});

		expect(['pz-0-A1', 'hex-1-1']).toContain(under);

		// And the piece under it is still there to be picked up — everybody moves everybody's
		// pieces, so the next player selecting it is an ordinary thing to do.
		await page.click('#pz-0-A1');
		expect(await get.team(0).agent(1).isHighlighted).toBe(true);
	});

	test('moves to the next player’s cell when they hand the turn on', async ({ page, clickOn }) => {
		await anAgentPutDownOnACell(page, clickOn);
		await page.click('#next-turn');

		await clickOn.team(1).agent(1);
		await clickOn.cell(5, 3);
		await clickOn.cell(6, 2);
		await page.click('#next-turn');

		await expect(page.locator('#last-move-0-A1')).toHaveCount(0);
		await expect(page.locator('#last-move-1-A1')).toBeVisible();
	});
});
