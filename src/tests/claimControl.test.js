import { goToPlay } from './helpers/navigation.js';
import clickOn from './helpers/clickOn';
import get, { DIRECTION } from './helpers/get';

describe('CLAIM CONTROL', () => {
	beforeEach(async () => {
		await goToPlay(2);
	});

	it('selects CEO when "Claim Control" is clicked', async () => {
		await page.click('#claim-0');

		expect(await get.cell(3, 3).isHighlighted).toBeTruthy();
		expect(await get.piece.ceo(0).isHighlighted).toBeTruthy();
		expect(await page.$eval('#claim-0', el => el.innerText)).toEqual('Cancel');
		expect(await page.$('#controlled-0')).toBe(null);
	});

	it('deselects CEO when "Cancel" is clicked', async () => {
		await page.click('#claim-0');
		await page.click('#claim-0');

		expect(await get.cell(3, 3).isHighlighted).toBeFalsy();
		expect(await get.piece.ceo(0).isHighlighted).toBeFalsy();
		expect(await page.$eval('#claim-0', el => el.innerText)).toEqual('Claim Control');
		expect(await page.$('#controlled-0')).toBe(null);
	});

	it('removes "Cancel" when deselecting CEO', async () => {
		await page.click('#claim-0');

		await clickOn.team(0).ceo();

		expect(await get.cell(3, 3).isHighlighted).toBeFalsy();
		expect(await get.piece.ceo(0).isHighlighted).toBeFalsy();
		expect(await page.$eval('#claim-0', el => el.innerText)).toEqual('Claim Control');
		expect(await page.$('#controlled-0')).toBe(null);
	});

	it('sets control when placing CEO', async () => {
		await page.click('#claim-0');

		await clickOn.cell(3, 3);
		await clickOn.cell(3, 3);

		expect(await get.pieceIn(3, 3).id).toEqual('pz-0-C');
		expect(await get.piece.ceo(0).isHighlighted).toBeFalsy();
		expect(await page.$eval('#controlled-0', el => el.innerText)).toEqual('Controlled by: FEDE');
	});

	it('changes control when claiming another company', async () => {
		await page.click('#claim-0');

		await clickOn.cell(3, 3);
		await clickOn.cell(3, 3);

		await page.click('#next-turn');

		await clickOn.team(0).agent(1);
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

		await clickOn.team(0).agent(1);
		await clickOn.cell(2, 2);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await page.click('#claim-1');

		await clickOn.cell(4, 4);
		await clickOn.cell(4, 4);

		await page.click('#next-turn');

		await page.click('#claim-0');

		expect(await get.piece.ceo(0).isHighlighted).toBeFalsy();
		expect(await get.cell(4, 3).isHighlighted).toBeFalsy();
	});
});
