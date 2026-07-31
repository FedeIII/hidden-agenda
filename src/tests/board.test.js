import { goToPlay } from './helpers/navigation.js';
import clickOn from './helpers/clickOn';
import { dragFromTo, touchDragFromTo, pressWithoutMoving } from './helpers/drag';
import get from './helpers/get';

describe('BOARD', () => {
	beforeEach(async () => {
		await goToPlay(2);
	});

	// Regression: pz.isTogglePieceOnCellClick used to return true with nothing selected, and
	// the caller then read selectedPiece.id on undefined. The afterEach page-error check is
	// what actually catches the throw; the assertions confirm the click stays a no-op.
	it('ignores a click on an empty cell when no piece is selected', async () => {
		await clickOn.cell(3, 3);

		const childCount = await page.$eval('#hex-3-3', el => el.children.length);
		expect(childCount).toEqual(0);
	});

	it('ignores a click on an occupied cell when no piece is selected', async () => {
		await clickOn.team(0).agent(1);
		await clickOn.cell(3, 3);
		await clickOn.cell(4, 3);
		await page.click('#next-turn');

		// A1 is on the board and nothing is selected now.
		await clickOn.cell(3, 3);

		expect(await page.$eval('#hex-3-3', el => el.children[0].id)).toEqual('pz-0-A1');
	});
});

// Dragging is our own pointer-event code now rather than react-dnd, so it needs its own cover.
describe('DRAGGING', () => {
	beforeEach(async () => {
		await goToPlay(2);
	});

	it('places a piece dragged out of the HQ onto a cell', async () => {
		await dragFromTo('#pz-0-A1', '#hex-1-1');

		expect(await page.$eval('#hex-1-1', el => el.children[0].id)).toEqual('pz-0-A1');
	});

	it('moves a piece dragged to a legal cell', async () => {
		await clickOn.team(0).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);
		await page.click('#next-turn');

		// Two cells ahead of an agent facing down-right, so the drop lands on a legal cell.
		await dragFromTo('#pz-0-A1', '#hex-3-3');

		expect(await page.$eval('#hex-3-3', el => el.children[0].id)).toEqual('pz-0-A1');
		expect(await page.$eval('#hex-1-1', el => el.children.length)).toEqual(0);
	});

	it('leaves a piece put down on an illegal cell where it was', async () => {
		await clickOn.team(0).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);
		await page.click('#next-turn');

		// Behind the agent, so not a legal destination.
		await dragFromTo('#pz-0-A1', '#hex-0-0');

		expect(await page.$eval('#hex-1-1', el => el.children[0].id)).toEqual('pz-0-A1');
	});

	it('treats a press with no movement as a plain selection', async () => {
		await pressWithoutMoving('#pz-0-A1');

		expect(await get.team(0).agent(1).isHighlighted).toBe(true);
	});

	it('places a piece dragged by touch, which HTML5 drag-and-drop could never do', async () => {
		await touchDragFromTo('#pz-0-A1', '#hex-1-1');

		expect(await page.$eval('#hex-1-1', el => el.children[0].id)).toEqual('pz-0-A1');
	});
});
