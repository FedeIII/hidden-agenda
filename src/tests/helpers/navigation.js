const playerNames = ['Fede', 'Sara', 'Alex', 'Azyr', 'Azazyra', 'Azarog'];

export function createNavigation(page) {
	return async function goToPlay(numPlayers) {
		const players = playerNames.slice(0, numPlayers);
		const alignments = [];

		for (const [i, player] of players.entries()) {
			await page.fill(`#player-name${i + 1}`, player);
		}

		await page.click('#start-btn');
		await page.waitForSelector('#alignments-btn');

		for (const _player of players) {
			await page.click('#alingnment-card-friend');
			await page.click('#alingnment-card-foe');

			// The team INDEX, read off the card, rather than its printed name translated back through
			// TEAM_NAMES. The card carries a word of its own now ("Friend" over "RED"), so its innerText
			// is no longer a team name — and a helper that quietly returned undefined would have surfaced
			// as a selector like `#controlled-undefined`.
			const friend = await page.locator('#alingnment-card-friend [data-team]').getAttribute('data-team');
			const foe = await page.locator('#alingnment-card-foe [data-team]').getAttribute('data-team');

			alignments.push({ friend, foe });

			await page.click('#alignments-btn');
		}

		await page.click('#alignments-btn');

		// No wait for the piece images to load here any more. Pieces are <img> with only a width
		// set, so before the PNG decodes their box is empty — and playwright's actionability
		// check already refuses to click an element without a stable, non-empty bounding box.
		await page.waitForSelector('#pz-0-A1');

		return alignments;
	};
}

export default createNavigation;
