import { goToPlay } from './helpers/navigation.js';
import clickOn from './helpers/clickOn';

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
