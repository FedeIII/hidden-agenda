import { test, expect } from './fixtures';

test.describe('CLAIM CONTROL', () => {
	let alignments;

	test.beforeEach(async ({ page, clickOn, get, drag, goToPlay }) => {
		alignments = await goToPlay(2);
	});

	test('can place a piece from a company controlled by yourself', async ({ page, clickOn, get, drag, goToPlay }) => {
		await page.click('#claim-0');

		await clickOn.cell(3, 3);
		await clickOn.cell(3, 3);

		await page.click('#next-turn');

		await clickOn.team(1).agent(1);

		await clickOn.cell(4, 4);
		await clickOn.cell(4, 4);

		await page.click('#next-turn');

		await clickOn.team(0).agent(1);

		expect(await get.team(0).agent(1).isHighlighted).toBeTruthy();
		expect(await get.cell(2, 3).isHighlighted).toBeTruthy();

		await clickOn.cell(2, 2);
		await clickOn.cell(2, 2);

		expect(await get.pieceIn(2, 2).id).toEqual('pz-0-A1');
	});

	test('can move a piece from a company controlled by other player', async ({ page, clickOn, get, drag, goToPlay }) => {
		await page.click('#claim-0');

		await clickOn.cell(3, 3);
		await clickOn.cell(3, 3);

		await page.click('#next-turn');

		await clickOn.team(1).agent(1);

		await clickOn.cell(4, 4);
		await clickOn.cell(4, 4);

		await page.click('#next-turn');

		await clickOn.team(0).agent(1);

		await clickOn.cell(2, 2);
		await clickOn.cell(1, 2);

		await page.click('#next-turn');

		await clickOn.team(0).agent(1);

		expect(await get.team(0).agent(1).isHighlighted).toBeTruthy();
		expect(await get.cell(1, 2).isHighlighted).toBeTruthy();
		expect(await get.cell(0, 2).isHighlighted).toBeTruthy();
	});

	test('can NOT place a piece from a company controlled by other player', async ({
		page,
		clickOn,
		get,
		drag,
		goToPlay,
	}) => {
		await page.click('#claim-0');

		await clickOn.cell(3, 3);
		await clickOn.cell(3, 3);

		await page.click('#next-turn');

		await clickOn.team(0).agent(1);

		expect(await get.team(0).agent(1).isHighlighted).toBeFalsy();
		expect(await get.cell(4, 3).isHighlighted).toBeFalsy();
	});

	test.describe('claim control through "Claim Control" button', () => {
		test('selects CEO when "Claim Control" is clicked', async ({ page, clickOn, get, drag, goToPlay }) => {
			await page.click('#claim-0');

			expect(await get.cell(3, 3).isHighlighted).toBeTruthy();
			expect(await get.team(0).ceo().isHighlighted).toBeTruthy();
			await expect(page.locator('#claim-0')).toHaveText('Cancel');
			await expect(page.locator('#controlled-0')).toHaveCount(0);
		});

		test('deselects CEO when "Cancel" is clicked', async ({ page, clickOn, get, drag, goToPlay }) => {
			await page.click('#claim-0');
			await page.click('#claim-0');

			expect(await get.cell(3, 3).isHighlighted).toBeFalsy();
			expect(await get.team(0).ceo().isHighlighted).toBeFalsy();
			await expect(page.locator('#claim-0')).toHaveText('Claim Control');
			await expect(page.locator('#controlled-0')).toHaveCount(0);
		});

		test('sets control when placing CEO', async ({ page, clickOn, get, drag, goToPlay }) => {
			await page.click('#claim-0');

			await clickOn.cell(3, 3);
			await clickOn.cell(3, 3);

			expect(await get.pieceIn(3, 3).id).toEqual('pz-0-C');
			expect(await get.team(0).ceo().isHighlighted).toBeFalsy();
			await expect(page.locator('#controlled-0')).toHaveText('Controlled by: FEDE');
		});

		test('changes control when claiming another company', async ({ page, clickOn, get, drag, goToPlay }) => {
			await page.click('#claim-0');

			await clickOn.cell(3, 3);
			await clickOn.cell(3, 3);

			await page.click('#next-turn');

			await clickOn.team(1).agent(1);
			await clickOn.cell(2, 2);
			await clickOn.cell(2, 2);

			await page.click('#next-turn');

			await page.click('#claim-1');

			await clickOn.cell(4, 4);
			await clickOn.cell(4, 4);

			await expect(page.locator('#controlled-0')).toHaveCount(0);
			await expect(page.locator('#controlled-1')).toHaveText('Controlled by: FEDE');
		});

		test('can NOT take control of a company with its CEO deployed', async ({ page, clickOn, get, drag, goToPlay }) => {
			await page.click('#claim-0');

			await clickOn.cell(3, 3);
			await clickOn.cell(3, 3);

			await page.click('#next-turn');

			await clickOn.team(1).agent(1);
			await clickOn.cell(2, 2);
			await clickOn.cell(2, 2);

			await page.click('#next-turn');

			await page.click('#claim-1');

			await clickOn.cell(4, 4);
			await clickOn.cell(4, 4);

			await page.click('#next-turn');

			// Team 0's CEO is on the board, so its HQ cannot be claimed — and the button says so by being
			// disabled rather than by accepting a click and quietly doing nothing.
			await expect(page.locator('#claim-0')).toBeDisabled();

			expect(await get.team(0).ceo().isHighlighted).toBeFalsy();
			expect(await get.cell(4, 3).isHighlighted).toBeFalsy();
		});

		test('can NOT take control of a company when the turn has ended', async ({
			page,
			clickOn,
			get,
			drag,
			goToPlay,
		}) => {
			await clickOn.team(0).agent(1);
			await clickOn.cell(1, 1);
			await clickOn.cell(2, 2);

			await page.click('#claim-0');

			expect(await get.team(0).ceo().isHighlighted).toBeFalsy();
			expect(await get.cell(3, 3).isHighlighted).toBeFalsy();
		});
	});

	test.describe('claim control through "Reveal" button', () => {
		test('sets control when revealing friend', async ({ page, clickOn, get, drag, goToPlay }) => {
			await page.click('#reveal');
			await page.click('#reveal-friend');

			await expect(page.locator(`#controlled-${player(0).friend}`)).toHaveText('Controlled by: FEDE');
		});

		test('sets control when revealing foe', async ({ page, clickOn, get, drag, goToPlay }) => {
			await page.click('#reveal');
			await page.click('#reveal-foe');

			await expect(page.locator(`#controlled-${player(0).foe}`)).toHaveText('Controlled by: FEDE');
		});

		test('changes control when revealing the second alignment', async ({ page, clickOn, get, drag, goToPlay }) => {
			await page.click('#reveal');
			await page.click('#reveal-friend');

			await expect(page.locator(`#controlled-${player(0).friend}`)).toHaveText('Controlled by: FEDE');

			await page.click('#reveal-foe');

			await expect(page.locator(`#controlled-${player(0).foe}`)).toHaveText('Controlled by: FEDE');
		});
	});

	test.describe('snatch control', () => {
		test('replaces ceo control with reveal', async ({ page, clickOn, get, drag, goToPlay }) => {
			await page.click(`#claim-${player(1).friend}`);

			await clickOn.cell(3, 3);
			await clickOn.cell(3, 3);

			await page.click('#next-turn');

			await page.click('#reveal');
			await page.click('#reveal-friend');

			expect(await page.locator(`#controlled-${player(1).friend}`).innerText()).toEqual('Controlled by: SARA');
		});

		test('replaces reveal control with ceo', async ({ page, clickOn, get, drag, goToPlay }) => {
			await page.click('#reveal');
			await page.click('#reveal-friend');
			// A screen covers the board, so it has to be put away before anything is clicked on it.
			await page.click('#reveal-close');

			await clickOn.team(player(0).friend).agent(1);
			await clickOn.cell(3, 3);
			await clickOn.cell(3, 3);

			await page.click('#next-turn');

			await page.click(`#claim-${player(0).friend}`);
			await clickOn.cell(4, 4);
			await clickOn.cell(4, 4);

			expect(await page.locator(`#controlled-${player(0).friend}`).innerText()).toEqual('Controlled by: SARA');
		});

		test('can NOT remove control by claiming and cancelling control', async ({
			page,
			clickOn,
			get,
			drag,
			goToPlay,
		}) => {
			await page.click('#reveal');
			await page.click('#reveal-friend');
			// A screen covers the board, so it has to be put away before anything is clicked on it.
			await page.click('#reveal-close');

			await clickOn.team(0).agent(5);
			await clickOn.cell(3, 3);
			await clickOn.cell(3, 3);

			await page.click('#next-turn');

			await page.click(`#claim-${player(0).friend}`);
			await clickOn.team(player(0).friend).agent(1);

			expect(await get.team(player(0).friend).agent(1).isHighlighted).toBeFalsy();
		});
	});

	// goToPlay now hands back team indices, which is what every use of this wanted in the first place.
	const player = playerNumber => alignments[playerNumber];
});
