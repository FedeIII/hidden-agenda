describe('smoke tests', () => {
	it('renders players form', async () => {
		const text = await global.page.$eval('.game', el => el.innerText)
		
		expect(text).toContain('NUMBER OF PLAYERS');
	});
});
