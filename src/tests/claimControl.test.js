import { goToPlay } from './helpers/navigation.js';
import clickOn from './helpers/clickOn';
import get from './helpers/get';
import { TEAM_NAMES } from '../domain/teams.js';

describe('CLAIM CONTROL', () => {
	let alignments;

	beforeEach(async () => {
		alignments = await goToPlay(2);
	});

	it('can place a piece from a company controlled by yourself', async () => {
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

	it('can move a piece from a company controlled by other player', async () => {
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

	it('can NOT place a piece from a company controlled by other player', async () => {
		await page.click('#claim-0');

		await clickOn.cell(3, 3);
		await clickOn.cell(3, 3);

		await page.click('#next-turn');

		await clickOn.team(0).agent(1);

		expect(await get.team(0).agent(1).isHighlighted).toBeFalsy();
		expect(await get.cell(4, 3).isHighlighted).toBeFalsy();
	});

	describe('claim control through "Claim Control" button', () => {
		it('selects CEO when "Claim Control" is clicked', async () => {
			await page.click('#claim-0');
	
			expect(await get.cell(3, 3).isHighlighted).toBeTruthy();
			expect(await get.team(0).ceo().isHighlighted).toBeTruthy();
			expect(await page.$eval('#claim-0', el => el.innerText)).toEqual('Cancel');
			expect(await page.$('#controlled-0')).toBe(null);
		});

		it('deselects CEO when "Cancel" is clicked', async () => {
			await page.click('#claim-0');
			await page.click('#claim-0');
	
			expect(await get.cell(3, 3).isHighlighted).toBeFalsy();
			expect(await get.team(0).ceo().isHighlighted).toBeFalsy();
			expect(await page.$eval('#claim-0', el => el.innerText)).toEqual('Claim Control');
			expect(await page.$('#controlled-0')).toBe(null);
		});

		it('sets control when placing CEO', async () => {
			await page.click('#claim-0');
	
			await clickOn.cell(3, 3);
			await clickOn.cell(3, 3);
	
			expect(await get.pieceIn(3, 3).id).toEqual('pz-0-C');
			expect(await get.team(0).ceo().isHighlighted).toBeFalsy();
			expect(await page.$eval('#controlled-0', el => el.innerText)).toEqual('Controlled by: FEDE');
		});

		it('changes control when claiming another company', async () => {
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
	
			expect(await page.$('#controlled-0')).toBe(null);
			expect(await page.$eval('#controlled-1', el => el.innerText)).toEqual('Controlled by: FEDE');
		});

		it('can NOT take control of a company with its CEO deployed', async () => {
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
	
			await page.click('#claim-0');
	
			expect(await get.team(0).ceo().isHighlighted).toBeFalsy();
			expect(await get.cell(4, 3).isHighlighted).toBeFalsy();
		});
	});

	describe('claim control through "Reveal" button', () => {
		it('sets control when revealing friend', async () => {
			await page.click('#reveal');
			await page.click('#reveal-friend');
	
			expect(await page.$eval(`#controlled-${player(0).friend}`, el => el.innerText)).toEqual('Controlled by: FEDE');
		});

		it('sets control when revealing foe', async () => {
			await page.click('#reveal');
			await page.click('#reveal-foe');
	
			expect(await page.$eval(`#controlled-${player(0).foe}`, el => el.innerText)).toEqual('Controlled by: FEDE');
		});

		it('changes control when revealing the second alignment', async () => {
			await page.click('#reveal');
			await page.click('#reveal-friend');
	
			expect(await page.$eval(`#controlled-${player(0).friend}`, el => el.innerText)).toEqual('Controlled by: FEDE');

			await page.click('#reveal-foe');
	
			expect(await page.$eval(`#controlled-${player(0).foe}`, el => el.innerText)).toEqual('Controlled by: FEDE');
		});
	});

	describe('snatch control', () => {
		it('replaces ceo control with reveal', async () => {
			await page.click(`#claim-${player(1).friend}`);

			await clickOn.cell(3, 3);
			await clickOn.cell(3, 3);

			await page.click('#next-turn');

			await page.click('#reveal');
			await page.click('#reveal-friend');

			expect(await page.$eval(`#controlled-${player(1).friend}`, el => el.innerText)).toEqual(
				'Controlled by: SARA',
			);
		});

		it('replaces reveal control with ceo', async () => {
			await page.click('#reveal');
			await page.click('#reveal-friend');

			await clickOn.team(player(0).friend).agent(1);
			await clickOn.cell(3, 3);
			await clickOn.cell(3, 3);

			await page.click('#next-turn');

			await page.click(`#claim-${player(0).friend}`);
			await clickOn.cell(4, 4);
			await clickOn.cell(4, 4);

			expect(await page.$eval(`#controlled-${player(0).friend}`, el => el.innerText)).toEqual(
				'Controlled by: SARA',
			);
		});

		it('can NOT remove control by claiming and cancelling control', async () => {
			await page.click('#reveal');
			await page.click('#reveal-friend');

			await clickOn.team(0).agent(5);
			await clickOn.cell(3, 3);
			await clickOn.cell(3, 3);

			await page.click('#next-turn');

			await page.click(`#claim-${player(0).friend}`);
			await clickOn.team(player(0).friend).agent(1);

			expect(await get.team(player(0).friend).agent(1).isHighlighted).toBeFalsy();
		});
	});

	const player = playerNumber => {
		return {
			get friend() {
				return Object.keys(TEAM_NAMES).find(key => TEAM_NAMES[key] == alignments[playerNumber].friend);
			},
			get foe() {
				return Object.keys(TEAM_NAMES).find(key => TEAM_NAMES[key] == alignments[playerNumber].foe);
			},
		};
	};
});
