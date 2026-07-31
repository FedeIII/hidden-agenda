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
