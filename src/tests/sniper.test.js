import { test, expect, DIRECTION } from './fixtures';

test.describe('SNIPER', () => {
	test.beforeEach(async ({ page, clickOn, get, drag, goToPlay }) => {
		await goToPlay(2);
	});

	test('can be placed in the board', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).sniper();
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);

		const pieceId = await get.pieceIn(1, 1).id;
		expect(pieceId).toEqual('pz-0-N');

		const pieceDirection = await get.pieceIn(1, 1).direction;
		expect(pieceDirection).toEqual(DIRECTION.down.right);
	});

	test('can be placed in the border of the board', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).sniper();
		await clickOn.cell(0, 0);
		await clickOn.cell(1, 1);

		const pieceId = await get.pieceIn(0, 0).id;
		expect(pieceId).toEqual('pz-0-N');

		const pieceDirection = await get.pieceIn(0, 0).direction;
		expect(pieceDirection).toEqual(DIRECTION.down.right);
	});

	test('can be placed in the border of the board facing outwards', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).sniper();
		await clickOn.cell(0, 0);
		await clickOn.cell(-1, -1);

		const pieceId = await get.pieceIn(0, 0).id;
		expect(pieceId).toEqual('pz-0-N');

		const pieceDirection = await get.pieceIn(0, 0).direction;
		expect(pieceDirection).toEqual(DIRECTION.up.left);
	});

	test('can NOT be placed in cell with another piece', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).sniper();

		const isHighlighted = await get.cell(1, 1).isHighlighted;
		expect(isHighlighted).toBeFalsy();
	});

	test('can be placed directed towards any direction', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).sniper();
		await clickOn.cell(1, 1);
		await clickOn.cell(0, 1);

		await page.click('#next-turn');

		await clickOn.team(1).sniper();
		await clickOn.cell(1, 2);
		await clickOn.cell(1, 3);

		await page.click('#next-turn');

		await clickOn.team(2).sniper();
		await clickOn.cell(2, 3);
		await clickOn.cell(3, 4);

		await page.click('#next-turn');

		await clickOn.team(3).sniper();
		await clickOn.cell(2, 2);
		await clickOn.cell(3, 2);

		const direction1 = await get.pieceIn(1, 1).direction;
		const direction2 = await get.pieceIn(1, 2).direction;
		const direction3 = await get.pieceIn(2, 3).direction;
		const direction4 = await get.pieceIn(2, 2).direction;

		expect(direction1).toEqual(DIRECTION.up.right);
		expect(direction2).toEqual(DIRECTION.right);
		expect(direction3).toEqual(DIRECTION.down.right);
		expect(direction4).toEqual(DIRECTION.down.left);
	});

	test('can NOT move', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).sniper();
		await clickOn.cell(3, 3);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).sniper();

		const cellAround1 = await get.cell(2, 2).isHighlighted;
		const cellAround2 = await get.cell(2, 3).isHighlighted;
		const cellAround3 = await get.cell(3, 2).isHighlighted;
		const cellAround4 = await get.cell(3, 4).isHighlighted;
		const cellAround5 = await get.cell(4, 2).isHighlighted;
		const cellAround6 = await get.cell(4, 3).isHighlighted;
		const cell2Over1 = await get.cell(1, 1).isHighlighted;
		const cell2Over2 = await get.cell(1, 2).isHighlighted;
		const cell2Over3 = await get.cell(1, 3).isHighlighted;
		const cell2Over4 = await get.cell(2, 4).isHighlighted;
		const cell2Over5 = await get.cell(3, 5).isHighlighted;
		const cell2Over6 = await get.cell(4, 4).isHighlighted;
		const cell2Over7 = await get.cell(5, 3).isHighlighted;
		const cell2Over8 = await get.cell(5, 2).isHighlighted;
		const cell2Over9 = await get.cell(5, 1).isHighlighted;
		const cell2Over10 = await get.cell(4, 1).isHighlighted;
		const cell2Over11 = await get.cell(3, 1).isHighlighted;
		const cell2Over12 = await get.cell(2, 1).isHighlighted;

		expect(cellAround1).toBeFalsy();
		expect(cellAround2).toBeFalsy();
		expect(cellAround3).toBeFalsy();
		expect(cellAround4).toBeFalsy();
		expect(cellAround5).toBeFalsy();
		expect(cellAround6).toBeFalsy();
		expect(cell2Over1).toBeFalsy();
		expect(cell2Over2).toBeFalsy();
		expect(cell2Over3).toBeFalsy();
		expect(cell2Over4).toBeFalsy();
		expect(cell2Over5).toBeFalsy();
		expect(cell2Over6).toBeFalsy();
		expect(cell2Over7).toBeFalsy();
		expect(cell2Over8).toBeFalsy();
		expect(cell2Over9).toBeFalsy();
		expect(cell2Over10).toBeFalsy();
		expect(cell2Over11).toBeFalsy();
		expect(cell2Over12).toBeFalsy();
	});

	test('can turn into any direction', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(1).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).sniper();
		await clickOn.cell(3, 3);
		await clickOn.cell(2, 3);

		await page.click('#next-turn');

		await clickOn.team(0).sniper();
		await clickOn.cell(3, 4);

		let direction = await get.pieceIn(3, 3).direction;
		expect(direction).toEqual(DIRECTION.right);

		await page.click('#next-turn');

		await clickOn.team(0).sniper();
		await clickOn.cell(4, 3);

		direction = await get.pieceIn(3, 3).direction;
		expect(direction).toEqual(DIRECTION.down.right);

		await page.click('#next-turn');

		await clickOn.team(0).sniper();
		await clickOn.cell(4, 2);

		direction = await get.pieceIn(3, 3).direction;
		expect(direction).toEqual(DIRECTION.down.left);

		await page.click('#next-turn');

		await clickOn.team(0).sniper();
		await clickOn.cell(3, 2);

		direction = await get.pieceIn(3, 3).direction;
		expect(direction).toEqual(DIRECTION.left);

		await page.click('#next-turn');

		await clickOn.team(0).sniper();
		await clickOn.cell(2, 2);

		direction = await get.pieceIn(3, 3).direction;
		expect(direction).toEqual(DIRECTION.up.left);

		await page.click('#next-turn');

		await clickOn.team(0).sniper();
		await clickOn.cell(2, 3);

		direction = await get.pieceIn(3, 3).direction;
		expect(direction).toEqual(DIRECTION.up.right);
	});

	test('blocks line of sight for other pieces placement', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).sniper();
		await clickOn.cell(2, 0);
		await clickOn.cell(2, 1);

		await page.click('#next-turn');

		await clickOn.team(1).agent(1);

		const cell1 = await get.cell(2, 1).isHighlighted;
		const cell2 = await get.cell(2, 2).isHighlighted;
		const cell3 = await get.cell(2, 3).isHighlighted;
		const cell4 = await get.cell(2, 4).isHighlighted;
		const cell5 = await get.cell(2, 5).isHighlighted;

		expect(cell1).toBeFalsy();
		expect(cell2).toBeFalsy();
		expect(cell3).toBeFalsy();
		expect(cell4).toBeFalsy();
		expect(cell5).toBeFalsy();
	});

	test.describe('kill', () => {
		test('kills on "snipe!" button when a piece moves through the line of sight', async ({ page, clickOn, get, drag, goToPlay }) => {
			await clickOn.team(1).agent(1);
			await clickOn.cell(2, 1);
			await clickOn.cell(1, 1);

			await page.click('#next-turn');

			await clickOn.team(0).sniper();
			await clickOn.cell(3, 3);
			await clickOn.cell(2, 2);

			await page.click('#next-turn');

			await clickOn.team(1).agent(1);
			await clickOn.cell(0, 1);
			await clickOn.cell(0, 1);

			await page.click('#snipe');

			const isHighlighted = await get.pieceIn(3, 3).isHighlighted;
			expect(isHighlighted).toBeTruthy();

			await clickOn.team(0).sniper();

			const agentCount = await get.cementery(0).agent;
			expect(agentCount).toEqual('x 1');
		});

		test('kills on "snipe!" button when a piece moves out of the line of sight', async ({ page, clickOn, get, drag, goToPlay }) => {
			await clickOn.team(1).agent(1);
			await clickOn.cell(2, 1);
			await clickOn.cell(1, 1);

			await page.click('#next-turn');

			await clickOn.team(0).sniper();
			await clickOn.cell(5, 2);
			await clickOn.cell(4, 2);

			await page.click('#next-turn');

			await clickOn.team(1).agent(1);
			await clickOn.cell(0, 1);
			await clickOn.cell(0, 1);

			await page.click('#snipe');

			const isHighlighted = await get.pieceIn(5, 2).isHighlighted;
			expect(isHighlighted).toBeTruthy();

			await clickOn.team(0).sniper();

			const agentCount = await get.cementery(0).agent;
			expect(agentCount).toEqual('x 1');
		});

		test('kills on "snipe!" button when a piece moves into the line of sight', async ({ page, clickOn, get, drag, goToPlay }) => {
			await clickOn.team(1).agent(1);
			await clickOn.cell(2, 1);
			await clickOn.cell(1, 1);

			await page.click('#next-turn');

			await clickOn.team(0).sniper();
			await clickOn.cell(4, 4);
			await clickOn.cell(3, 4);

			await page.click('#next-turn');

			await clickOn.team(1).agent(1);
			await clickOn.cell(0, 1);
			await clickOn.cell(0, 1);

			await page.click('#snipe');

			const isHighlighted = await get.pieceIn(4, 4).isHighlighted;
			expect(isHighlighted).toBeTruthy();

			await clickOn.team(0).sniper();

			const agentCount = await get.cementery(0).agent;
			expect(agentCount).toEqual('x 1');
		});

		test('kills to avoid consecuences', async ({ page, clickOn, get, drag, goToPlay }) => {
			await clickOn.team(1).agent(1);
			await clickOn.cell(2, 1);
			await clickOn.cell(1, 1);

			await page.click('#next-turn');

			await clickOn.team(0).agent(1);
			await clickOn.cell(0, 1);
			await clickOn.cell(1, 2);

			await page.click('#next-turn');

			await clickOn.team(0).sniper();
			await clickOn.cell(5, 2);
			await clickOn.cell(4, 2);

			await page.click('#next-turn');

			await clickOn.team(1).agent(1);
			await clickOn.cell(0, 1);
			await clickOn.cell(0, 1);

			await page.click('#snipe');

			await clickOn.team(0).sniper();

			const pieceId = await get.pieceIn(0, 1).id;
			expect(pieceId).toEqual('pz-0-A1');
		});

		test('does NOT kill if the moving piece is from the same team', async ({ page, clickOn, get, drag, goToPlay }) => {
			await clickOn.team(0).agent(1);
			await clickOn.cell(2, 1);
			await clickOn.cell(1, 1);

			await page.click('#next-turn');

			await clickOn.team(0).sniper();
			await clickOn.cell(3, 3);
			await clickOn.cell(2, 2);

			await page.click('#next-turn');

			await clickOn.team(0).agent(1);
			await clickOn.cell(0, 1);
			await clickOn.cell(0, 1);

			await page.click('#snipe');

			const isHighlighted = await get.pieceIn(3, 3).isHighlighted;
			expect(isHighlighted).toBeFalsy();
		});

		test('does NOT kill if vision is blocked', async ({ page, clickOn, get, drag, goToPlay }) => {
			await clickOn.team(2).agent(1);
			await clickOn.cell(2, 2);
			await clickOn.cell(1, 1);

			await page.click('#next-turn');

			await clickOn.team(1).agent(1);
			await clickOn.cell(2, 1);
			await clickOn.cell(0, 1);

			await page.click('#next-turn');

			await clickOn.team(0).sniper();
			await clickOn.cell(5, 3);
			await clickOn.cell(4, 3);

			await page.click('#next-turn');

			await clickOn.team(1).agent(1);
			await clickOn.cell(0, 1);
			await clickOn.cell(0, 1);

			await page.click('#snipe');

			const isHighlighted = await get.pieceIn(5, 3).isHighlighted;
			expect(isHighlighted).toBeFalsy();
		});
	});

	test.describe('CEO buff', () => {
		test.beforeEach(async ({ page, clickOn, get, drag, goToPlay }) => {
			await clickOn.team(0).ceo();
			await clickOn.cell(6, 2);
			await clickOn.cell(2, 2);

			await page.click('#next-turn');
		});

		test('can kill through other pieces', async ({ page, clickOn, get, drag, goToPlay }) => {
			await clickOn.team(2).agent(1);
			await clickOn.cell(2, 2);
			await clickOn.cell(1, 1);

			await page.click('#next-turn');

			await clickOn.team(1).agent(1);
			await clickOn.cell(2, 1);
			await clickOn.cell(0, 1);

			await page.click('#next-turn');

			await clickOn.team(0).sniper();
			await clickOn.cell(5, 3);
			await clickOn.cell(4, 3);

			await page.click('#next-turn');

			await clickOn.team(1).agent(1);
			await clickOn.cell(0, 1);
			await clickOn.cell(0, 1);

			await page.click('#snipe');

			const isHighlighted = await get.pieceIn(5, 3).isHighlighted;
			expect(isHighlighted).toBeTruthy();

			await clickOn.team(0).sniper();

			const agentCount = await get.cementery(0).agent;
			expect(agentCount).toEqual('x 1');
		});
	});
});
