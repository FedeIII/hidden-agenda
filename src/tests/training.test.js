import { test, expect, DIRECTION } from './fixtures';

// Field training, from the outside.
//
// What the domain spec next door proves is that every exercise can be finished by clicking exactly
// what is marked, through the real reducer. What only a browser can show is the other half: that the
// marked things are on the screen and clickable, that the gate stops everything else, and that the
// board the learner is clicking is the game's own board rather than a picture of one.

// Through the menu, the way `rules.test.js` does it, and not the shared `page` fixture: that lands
// every other spec straight in a one-tab game, where there is no index to open this from. Not to the
// hash directly either — the whole screen is one mounted component that writes its own hash, so a
// same-document hash change is never heard.
async function openTraining(page) {
	await page.goto('/');
	await page.click('#lobby-menu-rules');
	await page.click('#rules-open-training');
}

async function goToExercise(page, slug) {
	await openTraining(page);
	await page.click(`#training-go-${slug}`);
	await expect(page.locator('#training-step')).toContainText('Step 1');
}

const verb = page => page.locator('#training-verb');
const step = page => page.locator('#training-step');

test.describe('FIELD TRAINING', () => {
	test('is offered from the rules index and opens on the first exercise', async ({ page }) => {
		await page.goto('/');
		await page.click('#lobby-menu-rules');

		await expect(page.locator('#rules-open-training')).toBeVisible();

		await page.click('#rules-open-training');

		await expect(page.locator('#training-title')).toContainText('Friend & Foe');
		await expect(verb(page)).toHaveText('LOOK');
		expect(page.url()).toContain('#/training/cards');
	});

	// The premise before any of the mechanics: two cards, and only you may look at them.
	test('turns over both cards and names the two teams', async ({ page }) => {
		await openTraining(page);

		await page.click('#training-card-friend');
		await expect(step(page)).toContainText('Step 2');

		await page.click('#training-card-foe');

		// The team is read off the attribute, never off the card's text — the card carries a good
		// deal of its own words now and none of them is a team name.
		await expect(page.locator('#training-card-friend [data-team]')).toHaveAttribute('data-team', '0');
		await expect(page.locator('#training-card-foe [data-team]')).toHaveAttribute('data-team', '1');
		await expect(page.locator('#training-finding')).toBeVisible();
	});

	// Select, move, point, pass — on the real board, with the real turn strip underneath it.
	//
	// The pointing is one click on the cell being pointed at, which is how the game itself works and
	// why it is one step: crossing a cell aims the piece and clicking it lets go. Going back to click
	// the *piece* crosses its own cell on the way and aims it there, so the facing just chosen would
	// be undone by the very click meant to keep it.
	test('walks a piece through select, move, point and pass', async ({ page, get, clickOn }) => {
		await goToExercise(page, 'move');

		await clickOn.team(0).agent(1);
		await expect(verb(page)).toHaveText('MOVE');
		// The board answers the selection itself: exactly the cell two ahead lights up.
		expect(await get.cell(3, 3).isHighlighted).toBe(true);

		await clickOn.cell(3, 3);
		await expect(verb(page)).toHaveText('POINT');
		expect(await get.pieceIn(3, 3).id).toEqual('pz-0-A1');

		await clickOn.cell(2, 3);
		await expect(verb(page)).toHaveText('PASS');
		expect(await get.nextTurn.isActive).toBe(true);
		// And the facing it was pointed in is the facing it kept.
		expect(await get.pieceIn(3, 3).direction).toEqual(DIRECTION.up.right);

		await page.click('#next-turn');
		await expect(page.locator('#training-finding')).toBeVisible();
		await expect(page.locator('#turn-player')).toHaveText('SARA');
	});

	// The gate is what makes the course impossible to get stuck in. It is enforced on the dispatch,
	// so an off-script click reaches the board and is refused there rather than being blocked by
	// something laid over the table — which would break every other click as well.
	test('does nothing at all when a click is off script', async ({ page, get, clickOn }) => {
		await goToExercise(page, 'agent');

		// The red agent is on the board and perfectly clickable. It is not what this step asked for.
		await clickOn.team(1).agent(1);

		expect(await get.team(1).agent(1).isHighlighted).toBe(false);
		await expect(verb(page)).toHaveText('SELECT');
		await expect(step(page)).toContainText('Step 1');
	});

	test('kills by landing on the enemy, and the tally lands on the killer', async ({ page, get, clickOn }) => {
		await goToExercise(page, 'agent');

		await clickOn.team(0).agent(1);
		await clickOn.cell(3, 3);

		expect(await get.pieceIn(3, 3).id).toEqual('pz-0-A1');
		await expect(page.locator('#piece-count-0-A')).toContainText('1');
	});

	// The spy's own page says red is now and teal is next. That is a rule about the board, so the
	// exercise shows it rather than saying it.
	test('shows the spy the rest of its walk before it takes the first step', async ({ page, get, clickOn }) => {
		await goToExercise(page, 'spy');

		await clickOn.team(0).spy();

		const now = await get.cell(3, 2).highlightMark;
		const next = await get.cell(3, 3).highlightMark;

		expect(now).not.toEqual('');
		expect(next).not.toEqual('');
		expect(next).not.toEqual(now);

		await clickOn.cell(3, 2);
		await clickOn.cell(3, 3);

		// A spy has no turning step: its last one both points it and puts it down.
		await expect(page.locator('#training-finding')).toBeVisible();
		expect(await get.pieceIn(3, 3).id).toEqual('pz-0-S');
	});

	// Two enemies exactly as close, and only the one with its back turned lights up. The other gets
	// the crossed ring, which says why without a word of it.
	test('offers the spy the back turned to it and refuses the face', async ({ page, get, clickOn }) => {
		await goToExercise(page, 'spy');

		await clickOn.team(0).spy();
		await clickOn.cell(3, 2);

		expect(await get.cell(3, 3).isHighlighted).toBe(true);
		expect(await get.cell(2, 2).isHighlighted).toBe(false);
		await expect(page.locator('#training-mark-hex-2-2')).toBeVisible();
	});

	// The buff is worked out once, when a turn starts — so a CEO brought up beside a stuck agent
	// changes nothing at all until NEXT TURN is pressed. That is the whole of this exercise.
	test('unsticks an agent by standing its CEO beside it, one turn later', async ({ page, get, clickOn }) => {
		await goToExercise(page, 'buff');

		// The spy, buffed, marks three rings out instead of two.
		await clickOn.team(0).spy();
		const now = await get.cell(3, 1).highlightMark;
		const third = await get.cell(2, 1).highlightMark;
		expect(now).not.toEqual('');
		expect(third).not.toEqual('');
		expect(third).not.toEqual(now);
		await clickOn.team(0).spy();

		// The sniper, buffed, sees straight through the piece in its line: the red agent stands on
		// [3, 4] and the line is drawn past it, all the way to the edge.
		await clickOn.team(0).sniper();
		await clickOn.cell(4, 3);
		expect(await get.pieceIn(3, 4).id).toEqual('pz-1-A2');
		await expect(page.locator('#training-mark-hex-2-4')).toBeVisible();
		await page.click('#next-turn');

		// The agent has an enemy one cell ahead, which for an unbuffed agent is a wall.
		await clickOn.team(0).agent(1);
		expect(await get.cell(2, 3).isHighlighted).toBe(false);
		await clickOn.team(0).agent(1);

		// Two clicks, like the spy: a CEO faces the way it just went, so the move puts it down.
		await clickOn.team(0).ceo();
		await clickOn.cell(3, 2);

		// Still nothing: the CEO is beside it, but the turn has not turned over.
		await expect(page.locator('#training-verb')).toHaveText('PASS');
		await page.click('#next-turn');

		await clickOn.team(0).agent(1);
		expect(await get.cell(2, 3).isHighlighted).toBe(true);

		await clickOn.cell(2, 3);
		await expect(page.locator('#training-finding')).toBeVisible();
	});

	test('hands the snipe to the table and rolls the move back', async ({ page, get, clickOn }) => {
		await goToExercise(page, 'sniper');

		// The line runs the width of the board with nothing standing in it.
		await expect(page.locator('#training-mark-hex-3-6')).toBeVisible();

		await clickOn.team(0).agent(1);
		await clickOn.cell(4, 3);
		await clickOn.team(0).agent(1);

		await expect(verb(page)).toHaveText('SNIPE');
		await page.click('#snipe');

		await expect(verb(page)).toHaveText('FIRE');
		await page.click('#pz-1-N');

		// The agent is gone, and the board is back to where the turn found it.
		expect(await get.cell(4, 3).isEmpty).toBe(true);
		expect(await get.cell(2, 2).isEmpty).toBe(true);
		await expect(page.locator('#piece-count-1-A')).toContainText('1');
	});

	// The other half of a line of fire: how far it reaches. A piece standing in it ends it there, and
	// the drawn line is the thing that says so — it simply stops.
	test('stops the drawn line at the first piece standing in it', async ({ page, clickOn }) => {
		await goToExercise(page, 'sniper');

		await clickOn.team(0).agent(1);
		await clickOn.cell(4, 3);
		await clickOn.team(0).agent(1);
		await page.click('#snipe');
		await page.click('#pz-1-N');

		await expect(verb(page)).toHaveText('PASS');
		await page.click('#next-turn');

		await clickOn.team(0).agent(2);
		await clickOn.cell(3, 3);

		// Up to the piece and including it, and nothing beyond.
		await expect(page.locator('#training-mark-hex-3-3')).toBeVisible();
		await expect(page.locator('#training-mark-hex-3-4')).toHaveCount(0);
		await expect(page.locator('#training-mark-hex-3-6')).toHaveCount(0);
	});

	// Claiming a team IS deploying its CEO, and the HQ card is where that becomes real.
	test('puts a name on the HQ card once the claimed CEO lands', async ({ page, clickOn }) => {
		await goToExercise(page, 'control');

		await expect(page.locator('#controlled-1')).toHaveCount(0);

		await page.click('#claim-1');
		await clickOn.cell(3, 3);

		await expect(page.locator('#controlled-1')).toHaveText('YOU');

		await clickOn.team(1).ceo();
		await expect(page.locator('#training-finding')).toBeVisible();
		await expect(page.locator('#training-mark-hq-control-1')).toBeVisible();
	});

	// A reveal is the game's own screen, opened by the game's own button. It costs fifty points and
	// buys the team at once, and the HQ card behind it is where the second half becomes visible.
	test('turns a card face up and hands over the team named on it', async ({ page }) => {
		await goToExercise(page, 'reveal');

		await page.click('#reveal');
		await expect(page.locator('#reveal-screen')).toBeVisible();

		await page.click('#reveal-friend');
		await expect(page.locator('#reveal-spent')).toContainText('50');

		await page.click('#reveal-close');
		await expect(page.locator('#controlled-0')).toHaveText('YOU');

		// What just changed is at the foot of a card nowhere near the last click, so the finding
		// rings it — and says which way the fifty points go, which the screen cannot show.
		await expect(page.locator('#training-mark-hq-control-0')).toBeVisible();
		await expect(page.locator('#training-finding-note')).toContainText('at once');
	});

	// The accuse screen asks three questions one at a time and takes the previous one away, so the
	// step carries three marks and exactly one of them is ever on the screen.
	test('rings each answer the accuse screen asks for, one at a time', async ({ page }) => {
		await goToExercise(page, 'accuse');

		await page.click('#accuse');
		await expect(page.locator('#training-mark-accuse-player-1')).toBeVisible();

		await page.click('#accuse-player-1');
		await expect(page.locator('#accuse-foe')).toBeVisible();

		await page.click('#accuse-foe');
		await page.click('#accuse-team-3');

		await expect(page.locator('#accuse-outcome')).toHaveText('Correct');
		await expect(page.locator('#accuse-consequence')).toContainText('50');
	});

	test('takes the reader to the rule page the exercise came from', async ({ page }) => {
		await goToExercise(page, 'ceo');

		await page.click('#training-go-cards');
		await page.click('#training-card-friend');
		await page.click('#training-card-foe');
		await page.click('#training-file');

		await expect(page.locator('#rules-next-top')).toBeVisible();
		expect(page.url()).toContain('#/rules/secret-cards');
	});

	// Every exercise starts again from the same board, so nothing can be left half-played.
	test('starts an exercise over from the top', async ({ page, get, clickOn }) => {
		await goToExercise(page, 'agent');

		await clickOn.team(0).agent(1);
		await clickOn.cell(3, 3);
		expect(await get.cell(3, 1).isEmpty).toBe(true);

		await page.click('#training-restart');

		await expect(step(page)).toContainText('Step 1');
		expect(await get.pieceIn(3, 1).id).toEqual('pz-0-A1');
		expect(await get.pieceIn(3, 3).id).toEqual('pz-1-A1');
	});

	/* ── The finding card's entrance ────────────────────────────────────────────────────────────
	 * The slip and the card take turns in one box, and they are nothing like the same height. What is
	 * worth asserting is not how it looks — that is a stamp coming down on a file and no spec can
	 * read it — but the two things that would be broken rather than merely different: that the box
	 * ends up exactly the size of what is in it, and that the entrance leaves nothing behind.
	 * ------------------------------------------------------------------------------------------- */

	// A transform still applied at rest is the failure mode with teeth: the card would sit a few
	// pixels off its own box for the rest of the exercise, and every hexagon under it with it.
	const residue = element => Math.round(element.getBoundingClientRect().height - element.offsetHeight);

	test('grows the box it shares with the slip, and settles exactly on the card', async ({ page, clickOn }) => {
		await goToExercise(page, 'ceo');

		const box = page.locator('#training-placard');
		const slipHeight = await box.evaluate(el => el.getBoundingClientRect().height);

		expect(await page.locator('#training-slip').evaluate(el => el.getBoundingClientRect().height)).toBeCloseTo(
			slipHeight,
			0,
		);

		await clickOn.team(0).ceo();
		await clickOn.cell(3, 3);

		await expect(page.locator('#training-finding')).toBeVisible();

		// The card is taller than the slip, so the box has somewhere to travel to — and once it has
		// arrived, nothing of the card is left below the edge the box clips at.
		await expect.poll(() => box.evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThan(slipHeight + 20);

		await expect
			.poll(() =>
				page.evaluate(() => {
					const placard = document.getElementById('training-placard').getBoundingClientRect();
					const card = document.getElementById('training-finding').getBoundingClientRect();

					return Math.round(card.bottom - placard.bottom);
				}),
			)
			.toBeLessThanOrEqual(0);

		await expect.poll(() => page.locator('#training-finding').evaluate(residue)).toBe(0);
		await expect(page.locator('#training-finding')).toHaveCSS('opacity', '1');
	});

	// An entrance is not continuous motion, but a player who has asked for neither gets the card and
	// none of it — the same answer the coach marks and the 3D layer already give.
	//
	// Emulated on the page rather than declared with `test.use({ reducedMotion })`, which does not
	// reach it: `fixtures.js` overrides the `page` fixture, and the preference never arrives.
	test('puts the card up with no entrance at all when less movement is asked for', async ({ page, clickOn }) => {
		await goToExercise(page, 'ceo');
		await page.emulateMedia({ reducedMotion: 'reduce' });

		await expect(page.locator('#training-placard')).toHaveCSS('transition-duration', '0s');

		await clickOn.team(0).ceo();
		await clickOn.cell(3, 3);

		const card = page.locator('#training-finding');

		await expect(card).toBeVisible();
		expect(await card.evaluate(el => getComputedStyle(el).animationName)).toBe('none');
		expect(await card.evaluate(residue)).toBe(0);
	});

	// The one rule the coach marks live under: the board is the game, and every hexagon is a
	// transparent element that has to keep receiving its own clicks.
	test('never lets a coach mark take a click off the board', async ({ page }) => {
		await goToExercise(page, 'agent');

		await expect(page.locator('#training-mark-pz-0-A1')).toBeVisible();

		const underTheMark = await page.locator('#training-mark-pz-0-A1').evaluate(mark => {
			const box = mark.getBoundingClientRect();
			const under = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);

			return under ? under.id || under.closest('[id]').id : null;
		});

		expect(underTheMark).toEqual('pz-0-A1');
	});

	test.describe('on a phone', () => {
		test.use({ viewport: { width: 390, height: 700 }, isMobile: true, hasTouch: true });

		// The board stacks between the two HQ pairs on a narrow screen, and a board too short to
		// aim at is a course nobody can take. This is the same budget the rule pages hold their
		// photographs to, for the same reason.
		test('keeps the board big enough to click', async ({ page }) => {
			await goToExercise(page, 'agent');

			const board = await page.locator('#board').boundingBox();

			expect(board.width).toBeGreaterThan(240);
			expect(board.height).toBeGreaterThan(180);
		});

		// A lesson that uses one team a side used to stack the game's way: one tray above the board
		// and one below. An HQ card is square, so the full-width one on top was also a full screen
		// tall, and the table the lesson is about started below the fold.
		//
		// Both go under the board now, each half the row. The half is what makes the card the same
		// width — and, being square, the same height — whether the lesson uses one tray or two, so
		// the board sits at one place on the screen for the whole course.
		test('puts both trays under the board, each half the row', async ({ page }) => {
			const cardBox = team => page.locator(`#store-${team}`).evaluate(el => el.parentElement.getBoundingClientRect());

			await goToExercise(page, 'agent');

			const board = await page.locator('#board').boundingBox();
			const [black, red] = [await cardBox(0), await cardBox(1)];

			expect(black.top).toBeGreaterThanOrEqual(board.y + board.height - 1);
			expect(red.top).toBeGreaterThanOrEqual(board.y + board.height - 1);

			// Side by side rather than one under the other.
			expect(Math.abs(black.top - red.top)).toBeLessThan(2);
			expect(red.left).toBeGreaterThanOrEqual(black.right - 1);

			// Half of the row each, to the gap between them — which is the sum a lesson with one
			// tray divides the same way, leaving the card exactly this wide.
			expect(black.width).toBeCloseTo(red.width, 0);
			expect(black.width + red.width).toBeCloseTo(board.width - 8, 0);
		});
	});
});
