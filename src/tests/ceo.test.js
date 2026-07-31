import { test, expect, DIRECTION } from './fixtures';

test.describe('CEO', () => {
	test.beforeEach(async ({ page, clickOn, get, drag, goToPlay }) => {
		await goToPlay(2);
	});

	test('can be placed in the board', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).ceo();
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);

		const pieceId = await get.pieceIn(1, 1).id;
		expect(pieceId).toEqual('pz-0-C');

		const pieceDirection = await get.pieceIn(1, 1).direction;
		expect(pieceDirection).toEqual(DIRECTION.down.right);
	});

	test('can be placed in the border of the board', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).ceo();
		await clickOn.cell(0, 0);
		await clickOn.cell(1, 1);

		const pieceId = await get.pieceIn(0, 0).id;
		expect(pieceId).toEqual('pz-0-C');

		const pieceDirection = await get.pieceIn(0, 0).direction;
		expect(pieceDirection).toEqual(DIRECTION.down.right);
	});

	test('can be placed in the border of the board facing outwards', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).ceo();
		await clickOn.cell(0, 0);
		await clickOn.cell(-1, -1);

		const pieceId = await get.pieceIn(0, 0).id;
		expect(pieceId).toEqual('pz-0-C');

		const pieceDirection = await get.pieceIn(0, 0).direction;
		expect(pieceDirection).toEqual(DIRECTION.up.left);
	});

	test('can NOT be placed in cell with another piece', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).ceo();

		const isHighlighted = await get.cell(1, 1).isHighlighted;
		expect(isHighlighted).toBeFalsy();
	});

	test('can be placed directed towards any direction', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).ceo();
		await clickOn.cell(1, 1);
		await clickOn.cell(0, 1);

		await page.click('#next-turn');

		await clickOn.team(1).ceo();
		await clickOn.cell(1, 2);
		await clickOn.cell(1, 3);

		await page.click('#next-turn');

		await clickOn.team(2).ceo();
		await clickOn.cell(1, 3);
		await clickOn.cell(2, 4);

		await page.click('#next-turn');

		await clickOn.team(3).ceo();
		await clickOn.cell(2, 1);
		await clickOn.cell(3, 1);

		const direction1 = await get.pieceIn(1, 1).direction;
		const direction2 = await get.pieceIn(1, 2).direction;
		const direction3 = await get.pieceIn(1, 3).direction;
		const direction4 = await get.pieceIn(2, 1).direction;

		expect(direction1).toEqual(DIRECTION.up.right);
		expect(direction2).toEqual(DIRECTION.right);
		expect(direction3).toEqual(DIRECTION.down.right);
		expect(direction4).toEqual(DIRECTION.down.left);
	});

	test('moves in any direction any distance', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).ceo();
		await clickOn.cell(3, 3);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).ceo();

		expect(await get.cell(2, 3).isHighlighted).toBeTruthy();
		expect(await get.cell(1, 3).isHighlighted).toBeTruthy();
		expect(await get.cell(0, 3).isHighlighted).toBeTruthy();

		expect(await get.cell(3, 4).isHighlighted).toBeTruthy();
		expect(await get.cell(3, 5).isHighlighted).toBeTruthy();
		expect(await get.cell(3, 6).isHighlighted).toBeTruthy();

		expect(await get.cell(4, 3).isHighlighted).toBeTruthy();
		expect(await get.cell(5, 3).isHighlighted).toBeTruthy();
		expect(await get.cell(6, 3).isHighlighted).toBeTruthy();

		expect(await get.cell(4, 2).isHighlighted).toBeTruthy();
		expect(await get.cell(5, 1).isHighlighted).toBeTruthy();
		expect(await get.cell(6, 0).isHighlighted).toBeTruthy();

		expect(await get.cell(3, 2).isHighlighted).toBeTruthy();
		expect(await get.cell(3, 1).isHighlighted).toBeTruthy();
		expect(await get.cell(3, 0).isHighlighted).toBeTruthy();

		expect(await get.cell(2, 2).isHighlighted).toBeTruthy();
		expect(await get.cell(1, 1).isHighlighted).toBeTruthy();
		expect(await get.cell(0, 0).isHighlighted).toBeTruthy();

		expect(await get.cell(2, 1).isHighlighted).toBeFalsy();
		expect(await get.cell(2, 4).isHighlighted).toBeFalsy();
		expect(await get.cell(4, 4).isHighlighted).toBeFalsy();
		expect(await get.cell(4, 1).isHighlighted).toBeFalsy();
	});

	test('is blocked by any piece', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).ceo();
		await clickOn.cell(3, 3);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).agent(1);
		await clickOn.cell(0, 3);
		await clickOn.cell(0, 3);

		await page.click('#next-turn');

		await clickOn.team(1).agent(1);
		await clickOn.cell(3, 5);
		await clickOn.cell(3, 5);

		await page.click('#next-turn');

		await clickOn.team(1).agent(2);
		await clickOn.cell(4, 3);
		await clickOn.cell(4, 3);

		await page.click('#next-turn');

		await clickOn.team(1).agent(3);
		await clickOn.cell(6, 0);
		await clickOn.cell(6, 0);

		await page.click('#next-turn');

		await clickOn.team(1).agent(4);
		await clickOn.cell(3, 1);
		await clickOn.cell(3, 1);

		await page.click('#next-turn');

		await clickOn.team(1).agent(5);
		await clickOn.cell(2, 2);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).ceo();

		expect(await get.cell(2, 3).isHighlighted).toBeTruthy();
		expect(await get.cell(1, 3).isHighlighted).toBeTruthy();
		expect(await get.cell(0, 3).isHighlighted).toBeFalsy();

		expect(await get.cell(3, 4).isHighlighted).toBeTruthy();
		expect(await get.cell(3, 5).isHighlighted).toBeFalsy();
		expect(await get.cell(3, 6).isHighlighted).toBeFalsy();

		expect(await get.cell(4, 3).isHighlighted).toBeFalsy();
		expect(await get.cell(5, 3).isHighlighted).toBeFalsy();
		expect(await get.cell(6, 3).isHighlighted).toBeFalsy();

		expect(await get.cell(4, 2).isHighlighted).toBeTruthy();
		expect(await get.cell(5, 1).isHighlighted).toBeTruthy();
		expect(await get.cell(6, 0).isHighlighted).toBeFalsy();

		expect(await get.cell(3, 2).isHighlighted).toBeTruthy();
		expect(await get.cell(3, 1).isHighlighted).toBeFalsy();
		expect(await get.cell(3, 0).isHighlighted).toBeFalsy();

		expect(await get.cell(2, 2).isHighlighted).toBeFalsy();
		expect(await get.cell(1, 1).isHighlighted).toBeFalsy();
		expect(await get.cell(0, 0).isHighlighted).toBeFalsy();

		expect(await get.cell(2, 1).isHighlighted).toBeFalsy();
		expect(await get.cell(2, 4).isHighlighted).toBeFalsy();
		expect(await get.cell(4, 4).isHighlighted).toBeFalsy();
		expect(await get.cell(4, 1).isHighlighted).toBeFalsy();
	});

	test('faces in the direction of the movement', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).ceo();
		await clickOn.cell(3, 3);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).ceo();
    await clickOn.cell(2, 3);
    await clickOn.cell(2, 3);

    expect(await get.pieceIn(2, 3).direction).toEqual(DIRECTION.up.right);
    
    await page.click('#next-turn');

		await clickOn.team(0).ceo();
    await clickOn.cell(2, 4);
    await clickOn.cell(2, 4);

    expect(await get.pieceIn(2, 4).direction).toEqual(DIRECTION.right);
    
    await page.click('#next-turn');

		await clickOn.team(0).ceo();
    await clickOn.cell(3, 5);
    await clickOn.cell(3, 5);

    expect(await get.pieceIn(3, 5).direction).toEqual(DIRECTION.down.right);
    
    await page.click('#next-turn');

		await clickOn.team(0).ceo();
    await clickOn.cell(5, 3);
    await clickOn.cell(5, 3);

    expect(await get.pieceIn(5, 3).direction).toEqual(DIRECTION.down.left);
    
    await page.click('#next-turn');

		await clickOn.team(0).ceo();
    await clickOn.cell(5, 1);
    await clickOn.cell(5, 1);

    expect(await get.pieceIn(5, 1).direction).toEqual(DIRECTION.left);
    
    await page.click('#next-turn');

		await clickOn.team(0).ceo();
    await clickOn.cell(3, 1);
    await clickOn.cell(3, 1);

		expect(await get.pieceIn(3, 1).direction).toEqual(DIRECTION.up.left);
	});
});
