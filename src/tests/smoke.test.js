import { goToPlay } from './helpers/navigation.js';

describe('Smoke', () => {
	it('renders players form', async () => {
		const text = await page.$eval('.game', el => el.innerText)
		
		expect(text).toContain('NUMBER OF PLAYERS');
	});

	it('reaches play phase', async () => {
		await goToPlay(2);

		expect(await page.$eval('#next-turn', el => el.innerText)).toEqual('NEXT TURN');
	});
});
