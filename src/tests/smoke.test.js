describe('Smoke', () => {
	it('renders players form', async () => {
		const text = await page.$eval('.game', el => el.innerText)
		
		expect(text).toContain('NUMBER OF PLAYERS');
	});
});
