const playerNames = ['Fede', 'Sara', 'Alex', 'Azyr', 'Azazyra', 'Azarog'];

export async function goToPlay(numPlayers) {
	const players = playerNames.slice(0, numPlayers);

	for (const [i, player] of players.entries()) {
		await page.type(`#player-name${i + 1}`, player);
	}

	await page.click('#start-btn');

	await page.waitForSelector('#alignments-btn');

	for (const _player of players) {
		await page.click('#alingnment-card-friend');
		await page.click('#alingnment-card-foe');
		await page.click('#alignments-btn');
	}

	await page.click('#alignments-btn');

	await page.waitForSelector('#pz-0-A1');
}
