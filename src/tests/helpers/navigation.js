const playerNames = ['Fede', 'Sara', 'Alex', 'Azyr', 'Azazyra', 'Azarog'];

export async function goToPlay(numPlayers) {
	const players = playerNames.slice(0, numPlayers);
	const alignments = [];

	for (const [i, player] of players.entries()) {
		await page.type(`#player-name${i + 1}`, player);
	}

	await page.click('#start-btn');

	await page.waitForSelector('#alignments-btn');

	for (const _player of players) {
		await page.click('#alingnment-card-friend');
		await page.click('#alingnment-card-foe');

		const friend = await page.$eval('#alingnment-card-friend', el => el.innerText);
		const foe = await page.$eval('#alingnment-card-foe', el => el.innerText);

		alignments.push({ friend, foe });

		await page.click('#alignments-btn');
	}

	await page.click('#alignments-btn');

	await page.waitForSelector('#pz-0-A1');
	await waitForPiecesToRender();

	return alignments;
}

// Pieces are <img> with only a width set, so until the PNG loads its height is 0 and the
// element's box is degenerate — page.click then aims at the wrong point. The first test in each
// file was the one that failed, because the rest ran with a warm HTTP cache.
async function waitForPiecesToRender() {
	await page.waitForFunction(() => {
		const images = Array.from(document.images);

		// Every piece type is a separate PNG, so waiting on one of them is not enough: the
		// agent specs passed while the sniper and spy specs raced their own images.
		return images.length > 0 && images.every(image => image.complete && image.naturalWidth > 0);
	});
}
