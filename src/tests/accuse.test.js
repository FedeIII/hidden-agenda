import { test, expect } from './fixtures';

// Accusing, and being told what happened.
//
// This flow had no spec at all, which is how the two facts that matter most about it stayed invisible
// for so long: whether the guess was right, and that a wrong one costs the right to guess that
// alignment again for the rest of the game.
//
// Two players, so the accusee is whoever is not on turn. `goToPlay` hands back each player's team
// indices, which is what makes it possible to accuse correctly on purpose.

const TEAMS = ['0', '1', '2', '3'];

// Any team that is not the right answer, so a wrong guess is a choice rather than a coin flip.
const wrongTeam = right => TEAMS.find(team => team !== String(right));

test.describe('ACCUSE', () => {
	test('the button says who cannot be accused, rather than offering everyone', async ({ page, goToPlay }) => {
		await goToPlay(2);
		await page.click('#accuse');

		// Two players, so exactly one seat to accuse: yourself is not a choice.
		await expect(page.locator('[id^="accuse-player-"]')).toHaveCount(1);
		await expect(page.locator('#accuse-player-1')).toContainText('SARA');
	});

	test('shows what is already public about a player before you guess', async ({ page, goToPlay }) => {
		await goToPlay(2);
		await page.click('#accuse');

		// Nothing has been revealed yet, and the choice says so rather than leaving it to memory.
		await expect(page.locator('#accuse-player-1')).toContainText('nothing public yet');
	});

	test('a correct guess says so, and says what it cost the accusee', async ({ page, goToPlay }) => {
		const alignments = await goToPlay(2);

		await page.click('#accuse');
		await page.click('#accuse-player-1');
		await page.click('#accuse-friend');
		await page.click(`#accuse-team-${alignments[1].friend}`);

		await expect(page.locator('#accuse-outcome')).toHaveText('Correct');
		await expect(page.locator('#accuse-detail')).toContainText("SARA's friend is");
		await expect(page.locator('#accuse-consequence')).toContainText('it is public now');
		await expect(page.locator('#accuse-consequence')).toContainText('cost SARA 50 points');
	});

	test('a wrong guess says so, and says what it cost you', async ({ page, goToPlay }) => {
		const alignments = await goToPlay(2);

		await page.click('#accuse');
		await page.click('#accuse-player-1');
		await page.click('#accuse-friend');
		await page.click(`#accuse-team-${wrongTeam(alignments[1].friend)}`);

		await expect(page.locator('#accuse-outcome')).toHaveText('Wrong');
		await expect(page.locator('#accuse-detail')).toContainText("SARA's friend is not");
		await expect(page.locator('#accuse-consequence')).toContainText('never accuse a friend again');
	});

	test('a wrong guess closes that alignment off, and says why', async ({ page, goToPlay }) => {
		const alignments = await goToPlay(2);

		await page.click('#accuse');
		await page.click('#accuse-player-1');
		await page.click('#accuse-friend');
		await page.click(`#accuse-team-${wrongTeam(alignments[1].friend)}`);
		await page.click('#accuse-close');

		// Back in again: the friend is closed off with a reason on it, and the foe is still open.
		await page.click('#accuse');
		await page.click('#accuse-player-1');

		await expect(page.locator('#accuse-friend')).toContainText('guessed a friend wrong already');
		await expect(page.locator('#accuse-friend')).toBeDisabled();
		await expect(page.locator('#accuse-foe')).not.toBeDisabled();
	});

	test('a correct guess keeps the right to accuse that alignment again', async ({ page, goToPlay }) => {
		const alignments = await goToPlay(2);

		await page.click('#accuse');
		await page.click('#accuse-player-1');
		await page.click('#accuse-foe');
		await page.click(`#accuse-team-${alignments[1].foe}`);
		await page.click('#accuse-close');

		await page.click('#accuse');
		await page.click('#accuse-player-1');

		// The right survives — but there is nothing left to take, and the reason says which of the two
		// it is. Those are different sentences on purpose.
		await expect(page.locator('#accuse-foe')).toContainText('already public');
	});

	test('shows the verdict once, not every time the screen is opened', async ({ page, goToPlay }) => {
		const alignments = await goToPlay(2);

		await page.click('#accuse');
		await page.click('#accuse-player-1');
		await page.click('#accuse-friend');
		await page.click(`#accuse-team-${alignments[1].friend}`);
		await expect(page.locator('#accuse-verdict')).toBeVisible();
		await page.click('#accuse-close');

		// The result is durable state — it is how an online accuser finds out at all — so opening the
		// screen again has to start a new accusation rather than re-announce the old one.
		await page.click('#accuse');

		await expect(page.locator('#accuse-verdict')).toHaveCount(0);
		await expect(page.locator('[id^="accuse-player-"]')).toHaveCount(1);
	});

	test('a correctly accused alignment becomes public to the whole table', async ({ page, goToPlay }) => {
		const alignments = await goToPlay(2);

		await page.click('#accuse');
		await page.click('#accuse-player-1');
		await page.click('#accuse-friend');
		await page.click(`#accuse-team-${alignments[1].friend}`);
		await page.click('#accuse-close');

		// And the ledger says HOW it became public, which is a different fact from the fact that it did:
		// SARA did not choose this.
		await page.click('#friend-foe');
		await page.click('#friend-foe-confirm');

		const ledger = page.locator('#friend-foe-ledger');
		await expect(ledger).toContainText('accused by FEDE');
		// One bar left, not two: SARA's friend is out and her foe is not.
		await expect(ledger.locator('[aria-label="withheld"]')).toHaveCount(1);
	});

	test('costs the player who was guessed fifty, and the one who guessed nothing', async ({ page, goToPlay }) => {
		// Being accused correctly and revealing set the same field and cost the same. Guessing right is
		// free, which is what makes accusing worth the risk of never being able to do it again.
		const alignments = await goToPlay(2);

		await page.click('#accuse');
		await page.click('#accuse-player-1');
		await page.click('#accuse-friend');
		await page.click(`#accuse-team-${alignments[1].friend}`);
		await page.click('#accuse-close');

		await page.click('#friend-foe');
		await page.click('#friend-foe-confirm');

		await expect(page.locator('#ledger-score-SARA')).toHaveAttribute('data-base', '50');
		await expect(page.locator('#ledger-score-FEDE')).toHaveAttribute('data-base', '100');
	});

	test('a wrong guess costs the accuser nothing off their score, only the right to guess again', async ({
		page,
		goToPlay,
	}) => {
		const alignments = await goToPlay(2);
		const wrong = ['0', '1', '2', '3'].find(team => team !== alignments[1].friend);

		await page.click('#accuse');
		await page.click('#accuse-player-1');
		await page.click('#accuse-friend');
		await page.click(`#accuse-team-${wrong}`);
		await page.click('#accuse-close');

		await page.click('#friend-foe');
		await page.click('#friend-foe-confirm');

		// Nobody has paid anything: the price of a wrong guess is the accusation itself, and the baseline
		// is the wrong place to look for it.
		await expect(page.locator('#ledger-score-FEDE')).toHaveAttribute('data-base', '100');
		await expect(page.locator('#ledger-score-SARA')).toHaveAttribute('data-base', '100');
	});
});

test.describe('REVEAL', () => {
	test('says what it costs before you spend it', async ({ page, goToPlay }) => {
		await goToPlay(2);
		await page.click('#reveal');

		await expect(page.locator('#reveal-note')).toContainText('costs 50 points');
		await expect(page.locator('#reveal-note')).toContainText('hands you that team at once');
	});

	test('turns the revealed card face up and keeps the tally', async ({ page, goToPlay }) => {
		await goToPlay(2);
		await page.click('#reveal');
		await page.click('#reveal-friend');

		// The card is the one the game dealt, now showing its team, and the screen says what has been
		// spent so far — which is as much use to a player as what the next one would cost.
		await expect(page.locator('#reveal-friend [data-team]')).toBeVisible();
		await expect(page.locator('#reveal-spent')).toContainText('50 points spent');

		await page.click('#reveal-foe');
		await expect(page.locator('#reveal-spent')).toContainText('100 points spent');
	});

	test('says when there is nothing left to give away', async ({ page, goToPlay }) => {
		await goToPlay(2);
		await page.click('#reveal');
		await page.click('#reveal-friend');
		await page.click('#reveal-foe');

		await expect(page.locator('#reveal-note')).toContainText('nothing left to give away');
		await page.click('#reveal-close');

		// And the button that opens it is dead, rather than opening a screen with nothing on it.
		await expect(page.locator('#reveal')).toBeDisabled();
	});

	test('a revealed alignment is not an accused one', async ({ page, goToPlay }) => {
		await goToPlay(2);
		await page.click('#reveal');
		await page.click('#reveal-friend');
		await page.click('#reveal-close');

		await page.click('#friend-foe');
		await page.click('#friend-foe-confirm');

		// Paid for, not taken. The two look identical in the old state and read completely differently
		// at a table.
		const ledger = page.locator('#friend-foe-ledger');
		await expect(ledger).toContainText('revealed');
		await expect(ledger).not.toContainText('accused by');
	});
});
