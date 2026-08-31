import { test, expect, DIRECTION } from './fixtures';

test.describe('SNIPER', () => {
	test.beforeEach(async ({ page, clickOn, get, drag, goToPlay }) => {
		await goToPlay(2);
	});

	test('can be placed in the board', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).sniper();
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);

		const pieceId = await get.pieceIn(1, 1).id;
		expect(pieceId).toEqual('pz-0-N');

		const pieceDirection = await get.pieceIn(1, 1).direction;
		expect(pieceDirection).toEqual(DIRECTION.down.right);
	});

	test('can be placed in the border of the board', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).sniper();
		await clickOn.cell(0, 0);
		await clickOn.cell(1, 1);

		const pieceId = await get.pieceIn(0, 0).id;
		expect(pieceId).toEqual('pz-0-N');

		const pieceDirection = await get.pieceIn(0, 0).direction;
		expect(pieceDirection).toEqual(DIRECTION.down.right);
	});

	test('can be placed in the border of the board facing outwards', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).sniper();
		await clickOn.cell(0, 0);
		await clickOn.cell(-1, -1);

		const pieceId = await get.pieceIn(0, 0).id;
		expect(pieceId).toEqual('pz-0-N');

		const pieceDirection = await get.pieceIn(0, 0).direction;
		expect(pieceDirection).toEqual(DIRECTION.up.left);
	});

	test('can NOT be placed in cell with another piece', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).sniper();

		const isHighlighted = await get.cell(1, 1).isHighlighted;
		expect(isHighlighted).toBeFalsy();
	});

	test('can be placed directed towards any direction', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).sniper();
		await clickOn.cell(1, 1);
		await clickOn.cell(0, 1);

		await page.click('#next-turn');

		await clickOn.team(1).sniper();
		await clickOn.cell(1, 2);
		await clickOn.cell(1, 3);

		await page.click('#next-turn');

		await clickOn.team(2).sniper();
		await clickOn.cell(2, 3);
		await clickOn.cell(3, 4);

		await page.click('#next-turn');

		await clickOn.team(3).sniper();
		await clickOn.cell(2, 2);
		await clickOn.cell(3, 2);

		const direction1 = await get.pieceIn(1, 1).direction;
		const direction2 = await get.pieceIn(1, 2).direction;
		const direction3 = await get.pieceIn(2, 3).direction;
		const direction4 = await get.pieceIn(2, 2).direction;

		expect(direction1).toEqual(DIRECTION.up.right);
		expect(direction2).toEqual(DIRECTION.right);
		expect(direction3).toEqual(DIRECTION.down.right);
		expect(direction4).toEqual(DIRECTION.down.left);
	});

	test('can NOT move', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).sniper();
		await clickOn.cell(3, 3);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).sniper();

		const cellAround1 = await get.cell(2, 2).isHighlighted;
		const cellAround2 = await get.cell(2, 3).isHighlighted;
		const cellAround3 = await get.cell(3, 2).isHighlighted;
		const cellAround4 = await get.cell(3, 4).isHighlighted;
		const cellAround5 = await get.cell(4, 2).isHighlighted;
		const cellAround6 = await get.cell(4, 3).isHighlighted;
		const cell2Over1 = await get.cell(1, 1).isHighlighted;
		const cell2Over2 = await get.cell(1, 2).isHighlighted;
		const cell2Over3 = await get.cell(1, 3).isHighlighted;
		const cell2Over4 = await get.cell(2, 4).isHighlighted;
		const cell2Over5 = await get.cell(3, 5).isHighlighted;
		const cell2Over6 = await get.cell(4, 4).isHighlighted;
		const cell2Over7 = await get.cell(5, 3).isHighlighted;
		const cell2Over8 = await get.cell(5, 2).isHighlighted;
		const cell2Over9 = await get.cell(5, 1).isHighlighted;
		const cell2Over10 = await get.cell(4, 1).isHighlighted;
		const cell2Over11 = await get.cell(3, 1).isHighlighted;
		const cell2Over12 = await get.cell(2, 1).isHighlighted;

		expect(cellAround1).toBeFalsy();
		expect(cellAround2).toBeFalsy();
		expect(cellAround3).toBeFalsy();
		expect(cellAround4).toBeFalsy();
		expect(cellAround5).toBeFalsy();
		expect(cellAround6).toBeFalsy();
		expect(cell2Over1).toBeFalsy();
		expect(cell2Over2).toBeFalsy();
		expect(cell2Over3).toBeFalsy();
		expect(cell2Over4).toBeFalsy();
		expect(cell2Over5).toBeFalsy();
		expect(cell2Over6).toBeFalsy();
		expect(cell2Over7).toBeFalsy();
		expect(cell2Over8).toBeFalsy();
		expect(cell2Over9).toBeFalsy();
		expect(cell2Over10).toBeFalsy();
		expect(cell2Over11).toBeFalsy();
		expect(cell2Over12).toBeFalsy();
	});

	test('can turn into any direction', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(1).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).sniper();
		await clickOn.cell(3, 3);
		await clickOn.cell(2, 3);

		await page.click('#next-turn');

		await clickOn.team(0).sniper();
		await clickOn.cell(3, 4);

		let direction = await get.pieceIn(3, 3).direction;
		expect(direction).toEqual(DIRECTION.right);

		await page.click('#next-turn');

		await clickOn.team(0).sniper();
		await clickOn.cell(4, 3);

		direction = await get.pieceIn(3, 3).direction;
		expect(direction).toEqual(DIRECTION.down.right);

		await page.click('#next-turn');

		await clickOn.team(0).sniper();
		await clickOn.cell(4, 2);

		direction = await get.pieceIn(3, 3).direction;
		expect(direction).toEqual(DIRECTION.down.left);

		await page.click('#next-turn');

		await clickOn.team(0).sniper();
		await clickOn.cell(3, 2);

		direction = await get.pieceIn(3, 3).direction;
		expect(direction).toEqual(DIRECTION.left);

		await page.click('#next-turn');

		await clickOn.team(0).sniper();
		await clickOn.cell(2, 2);

		direction = await get.pieceIn(3, 3).direction;
		expect(direction).toEqual(DIRECTION.up.left);

		await page.click('#next-turn');

		await clickOn.team(0).sniper();
		await clickOn.cell(2, 3);

		direction = await get.pieceIn(3, 3).direction;
		expect(direction).toEqual(DIRECTION.up.right);
	});

	// Selecting a deployed sniper goes straight to MOVEMENT, because turning is the only move it
	// has — so letting go of it again used to look exactly like finishing one, and handed the turn
	// on for nothing. Hovering is how a cell is aimed at; only the last one before the click counts.
	test('does NOT end the turn when it is left aiming where it already aimed', async ({ page, clickOn, get }) => {
		await clickOn.team(0).sniper();
		await clickOn.cell(3, 3);
		await clickOn.cell(2, 3);

		await page.click('#next-turn');

		await clickOn.team(0).sniper();
		await page.hover('#hex-4-3');
		await page.hover('#hex-3-2');
		await clickOn.cell(2, 3);

		const direction = await get.pieceIn(3, 3).direction;
		expect(direction).toEqual(DIRECTION.up.right);

		const isNextTurnActive = await get.nextTurn.isActive;
		expect(isNextTurnActive).toBeFalsy();
	});

	test('does end the turn when it is left aiming somewhere new', async ({ page, clickOn, get }) => {
		await clickOn.team(0).sniper();
		await clickOn.cell(3, 3);
		await clickOn.cell(2, 3);

		await page.click('#next-turn');

		await clickOn.team(0).sniper();
		await page.hover('#hex-4-3');
		await clickOn.cell(3, 2);

		const direction = await get.pieceIn(3, 3).direction;
		expect(direction).toEqual(DIRECTION.left);

		const isNextTurnActive = await get.nextTurn.isActive;
		expect(isNextTurnActive).toBeTruthy();
	});

	test('blocks line of sight for other pieces placement', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).sniper();
		await clickOn.cell(2, 0);
		await clickOn.cell(2, 1);

		await page.click('#next-turn');

		await clickOn.team(1).agent(1);

		const cell1 = await get.cell(2, 1).isHighlighted;
		const cell2 = await get.cell(2, 2).isHighlighted;
		const cell3 = await get.cell(2, 3).isHighlighted;
		const cell4 = await get.cell(2, 4).isHighlighted;
		const cell5 = await get.cell(2, 5).isHighlighted;

		expect(cell1).toBeFalsy();
		expect(cell2).toBeFalsy();
		expect(cell3).toBeFalsy();
		expect(cell4).toBeFalsy();
		expect(cell5).toBeFalsy();
	});

	test.describe('kill', () => {
		test('kills on "snipe!" button when a piece moves through the line of sight', async ({
			page,
			clickOn,
			get,
			drag,
			goToPlay,
		}) => {
			await clickOn.team(1).agent(1);
			await clickOn.cell(2, 1);
			await clickOn.cell(1, 1);

			await page.click('#next-turn');

			await clickOn.team(0).sniper();
			await clickOn.cell(3, 3);
			await clickOn.cell(2, 2);

			await page.click('#next-turn');

			await clickOn.team(1).agent(1);
			await clickOn.cell(0, 1);
			await clickOn.cell(0, 1);

			await page.click('#snipe');

			const isHighlighted = await get.pieceIn(3, 3).isHighlighted;
			expect(isHighlighted).toBeTruthy();

			await clickOn.team(0).sniper();

			const agentCount = await get.cementery(0).agent;
			expect(agentCount).toEqual('x 1');
		});

		test('kills on "snipe!" button when a piece moves out of the line of sight', async ({
			page,
			clickOn,
			get,
			drag,
			goToPlay,
		}) => {
			await clickOn.team(1).agent(1);
			await clickOn.cell(2, 1);
			await clickOn.cell(1, 1);

			await page.click('#next-turn');

			await clickOn.team(0).sniper();
			await clickOn.cell(5, 2);
			await clickOn.cell(4, 2);

			await page.click('#next-turn');

			await clickOn.team(1).agent(1);
			await clickOn.cell(0, 1);
			await clickOn.cell(0, 1);

			await page.click('#snipe');

			const isHighlighted = await get.pieceIn(5, 2).isHighlighted;
			expect(isHighlighted).toBeTruthy();

			await clickOn.team(0).sniper();

			const agentCount = await get.cementery(0).agent;
			expect(agentCount).toEqual('x 1');
		});

		test('kills on "snipe!" button when a piece moves into the line of sight', async ({
			page,
			clickOn,
			get,
			drag,
			goToPlay,
		}) => {
			await clickOn.team(1).agent(1);
			await clickOn.cell(2, 1);
			await clickOn.cell(1, 1);

			await page.click('#next-turn');

			await clickOn.team(0).sniper();
			await clickOn.cell(4, 4);
			await clickOn.cell(3, 4);

			await page.click('#next-turn');

			await clickOn.team(1).agent(1);
			await clickOn.cell(0, 1);
			await clickOn.cell(0, 1);

			await page.click('#snipe');

			const isHighlighted = await get.pieceIn(4, 4).isHighlighted;
			expect(isHighlighted).toBeTruthy();

			await clickOn.team(0).sniper();

			const agentCount = await get.cementery(0).agent;
			expect(agentCount).toEqual('x 1');
		});

		test('kills to avoid consecuences', async ({ page, clickOn, get, drag, goToPlay }) => {
			await clickOn.team(1).agent(1);
			await clickOn.cell(2, 1);
			await clickOn.cell(1, 1);

			await page.click('#next-turn');

			await clickOn.team(0).agent(1);
			await clickOn.cell(0, 1);
			await clickOn.cell(1, 2);

			await page.click('#next-turn');

			await clickOn.team(0).sniper();
			await clickOn.cell(5, 2);
			await clickOn.cell(4, 2);

			await page.click('#next-turn');

			await clickOn.team(1).agent(1);
			await clickOn.cell(0, 1);
			await clickOn.cell(0, 1);

			await page.click('#snipe');

			await clickOn.team(0).sniper();

			const pieceId = await get.pieceIn(0, 1).id;
			expect(pieceId).toEqual('pz-0-A1');
		});

		test('does NOT kill if the moving piece is from the same team', async ({ page, clickOn, get, drag, goToPlay }) => {
			await clickOn.team(0).agent(1);
			await clickOn.cell(2, 1);
			await clickOn.cell(1, 1);

			await page.click('#next-turn');

			await clickOn.team(0).sniper();
			await clickOn.cell(3, 3);
			await clickOn.cell(2, 2);

			await page.click('#next-turn');

			await clickOn.team(0).agent(1);
			await clickOn.cell(0, 1);
			await clickOn.cell(0, 1);

			await page.click('#snipe');

			const isHighlighted = await get.pieceIn(3, 3).isHighlighted;
			expect(isHighlighted).toBeFalsy();
		});

		test('does NOT kill if vision is blocked', async ({ page, clickOn, get, drag, goToPlay }) => {
			await clickOn.team(2).agent(1);
			await clickOn.cell(2, 2);
			await clickOn.cell(1, 1);

			await page.click('#next-turn');

			await clickOn.team(1).agent(1);
			await clickOn.cell(2, 1);
			await clickOn.cell(0, 1);

			await page.click('#next-turn');

			await clickOn.team(0).sniper();
			await clickOn.cell(5, 3);
			await clickOn.cell(4, 3);

			await page.click('#next-turn');

			await clickOn.team(1).agent(1);
			await clickOn.cell(0, 1);
			await clickOn.cell(0, 1);

			await page.click('#snipe');

			const isHighlighted = await get.pieceIn(5, 3).isHighlighted;
			expect(isHighlighted).toBeFalsy();
		});
	});

	// Lining a shot up takes the turn off the player who just moved until the table has answered.
	// There was no way to answer "no": the button did nothing on a second press, a piece cannot be
	// picked up while a snipe is armed, and the turn could not be passed — so a player who armed
	// one and thought better of it left the game with nothing anybody could do.
	test.describe('standing down', () => {
		async function aShotLinedUp(page, clickOn) {
			await clickOn.team(1).agent(1);
			await clickOn.cell(2, 1);
			await clickOn.cell(1, 1);

			await page.click('#next-turn');

			await clickOn.team(0).sniper();
			await clickOn.cell(3, 3);
			await clickOn.cell(2, 2);

			await page.click('#next-turn');

			await clickOn.team(1).agent(1);
			await clickOn.cell(0, 1);
			await clickOn.cell(0, 1);

			await page.click('#snipe');
		}

		test('gives the turn back when the shot is declined', async ({ page, clickOn, get }) => {
			await aShotLinedUp(page, clickOn);

			expect(await get.nextTurn.isActive).toBe(false);

			await page.click('#snipe');

			expect(await get.nextTurn.isActive).toBe(true);
			expect(await get.pieceIn(0, 1).id).toEqual('pz-1-A1');

			await page.click('#next-turn');
			await expect(page.locator('#turn-player')).toHaveText('SARA');
		});

		test('puts the sniper out again', async ({ page, clickOn, get }) => {
			await aShotLinedUp(page, clickOn);

			expect(await get.pieceIn(3, 3).isHighlighted).toBe(true);

			await page.click('#snipe');

			expect(await get.pieceIn(3, 3).isHighlighted).toBe(false);
		});

		test('says which of the two it is about to do', async ({ page, clickOn }) => {
			await expect(page.locator('#snipe')).toHaveText('SNIPE!');

			await aShotLinedUp(page, clickOn);
			await expect(page.locator('#snipe')).toHaveText('STAND DOWN');

			await page.click('#snipe');
			await expect(page.locator('#snipe')).toHaveText('SNIPE!');
		});

		test('can still take the shot after thinking about it', async ({ page, clickOn, get }) => {
			await aShotLinedUp(page, clickOn);

			await page.click('#snipe');
			await page.click('#snipe');

			await clickOn.team(0).sniper();

			expect(await get.cementery(0).agent).toEqual('x 1');
			expect(await get.nextTurn.isActive).toBe(true);
		});
	});

	// A sniper can be killed by the very move it saw: the mover walks its line and ends the walk on
	// its cell. The shot is still owed, and SNIPE lit a piece that was already in the cemetery — so
	// there was nothing on the board to click and the rest of the table could only stand down.
	test.describe('a sniper killed by the move it saw', () => {
		// 0-N watches [3, 2] and [3, 1] from [3, 3]. 1-A1 stands on [3, 1] and moves the two cells an
		// agent moves: it crosses [3, 2], which marks it, and lands on the sniper, which kills it.
		async function anAgentWalkingOntoTheSniper(page, clickOn) {
			await clickOn.team(1).agent(1);
			await clickOn.cell(3, 1);
			await clickOn.cell(3, 2);

			await page.click('#next-turn');

			await clickOn.team(0).sniper();
			await clickOn.cell(3, 3);
			await clickOn.cell(3, 2);

			await page.click('#next-turn');

			await clickOn.team(1).agent(1);
			await clickOn.cell(3, 3);
			await clickOn.cell(3, 3);
		}

		test('offers the cell it stood in, with a label saying so', async ({ page, clickOn, get }) => {
			await anAgentWalkingOntoTheSniper(page, clickOn);

			// Nothing before the table reaches for the button: a mark on the board would be telling
			// everybody a shot is there before anybody has spotted it.
			await expect(page.locator('#snipe-fallen-0-N')).toHaveCount(0);

			await page.click('#snipe');

			await expect(page.locator('#snipe-fallen-0-N')).toBeVisible();
			await expect(page.locator('#snipe-fallen-0-N')).toContainText('SNIPER DOWN');
			await expect(page.locator('#snipe-fallen-0-N')).toContainText('click its cell to fire');

			// It is the agent standing on that cell that fires the shot when clicked, so the mark
			// cannot be in the way of it.
			expect(await get.cell(3, 3).isEmpty).toBe(false);
		});

		test('fires from that cell, and the sniper comes back to life', async ({ page, clickOn, get }) => {
			await anAgentWalkingOntoTheSniper(page, clickOn);
			await page.click('#snipe');

			await clickOn.cell(3, 3);

			expect(await get.pieceIn(3, 3).id).toEqual('pz-0-N');
			expect(await get.cementery(0).agent).toEqual('x 1');
			expect(await get.nextTurn.isActive).toBe(true);
		});

		test('and the mark goes with the shot', async ({ page, clickOn }) => {
			await anAgentWalkingOntoTheSniper(page, clickOn);
			await page.click('#snipe');
			await clickOn.cell(3, 3);

			await expect(page.locator('#snipe-fallen-0-N')).toHaveCount(0);
			await expect(page.locator('#snipe')).toHaveText('SNIPE!');
		});

		test('standing down leaves it dead and the cell ordinary again', async ({ page, clickOn, get }) => {
			await anAgentWalkingOntoTheSniper(page, clickOn);
			await page.click('#snipe');
			await page.click('#snipe');

			await expect(page.locator('#snipe-fallen-0-N')).toHaveCount(0);

			// The cell is the agent's again, and clicking it does not fire anything.
			await clickOn.cell(3, 3);
			expect(await get.pieceIn(3, 3).id).toEqual('pz-1-A1');
			expect(await get.nextTurn.isActive).toBe(true);
		});

		// The window a shot is taken in used to be the turn it was provoked in. It runs until the
		// next player moves now, so NEXT TURN no longer takes the answer away from the table.
		test('can still be answered after the turn has been passed on', async ({ page, clickOn, get }) => {
			await anAgentWalkingOntoTheSniper(page, clickOn);
			await page.click('#next-turn');

			await expect(page.locator('#turn-player')).toHaveText('SARA');

			await page.click('#snipe');
			await expect(page.locator('#snipe-fallen-0-N')).toBeVisible();

			await clickOn.cell(3, 3);

			expect(await get.pieceIn(3, 3).id).toEqual('pz-0-N');
			expect(await get.cementery(0).agent).toEqual('x 1');
		});

		test('and answering costs the next player nothing: the turn is still theirs to spend', async ({
			page,
			clickOn,
			get,
		}) => {
			await anAgentWalkingOntoTheSniper(page, clickOn);
			await page.click('#next-turn');
			await page.click('#snipe');
			await clickOn.cell(3, 3);

			await expect(page.locator('#turn-player')).toHaveText('SARA');
			expect(await get.nextTurn.isActive).toBe(false);

			// The board is theirs again — an armed snipe is the state in which nothing can be
			// picked up, and firing has to be the end of that.
			await clickOn.team(2).agent(1);
			expect(await get.team(2).agent(1).isHighlighted).toBe(true);
		});

		test('is gone once that player has moved something', async ({ page, clickOn, get }) => {
			await anAgentWalkingOntoTheSniper(page, clickOn);
			await page.click('#next-turn');

			await clickOn.team(2).agent(1);
			await clickOn.cell(1, 1);
			await clickOn.cell(0, 1);

			await page.click('#snipe');

			await expect(page.locator('#snipe-fallen-0-N')).toHaveCount(0);
			expect(await get.pieceIn(3, 3).id).toEqual('pz-1-A1');
		});
	});

	test.describe('CEO buff', () => {
		test.beforeEach(async ({ page, clickOn, get, drag, goToPlay }) => {
			await clickOn.team(0).ceo();
			await clickOn.cell(6, 2);
			await clickOn.cell(2, 2);

			await page.click('#next-turn');
		});

		test('can kill through other pieces', async ({ page, clickOn, get, drag, goToPlay }) => {
			await clickOn.team(2).agent(1);
			await clickOn.cell(2, 2);
			await clickOn.cell(1, 1);

			await page.click('#next-turn');

			await clickOn.team(1).agent(1);
			await clickOn.cell(2, 1);
			await clickOn.cell(0, 1);

			await page.click('#next-turn');

			await clickOn.team(0).sniper();
			await clickOn.cell(5, 3);
			await clickOn.cell(4, 3);

			await page.click('#next-turn');

			await clickOn.team(1).agent(1);
			await clickOn.cell(0, 1);
			await clickOn.cell(0, 1);

			await page.click('#snipe');

			const isHighlighted = await get.pieceIn(5, 3).isHighlighted;
			expect(isHighlighted).toBeTruthy();

			await clickOn.team(0).sniper();

			const agentCount = await get.cementery(0).agent;
			expect(agentCount).toEqual('x 1');
		});
	});
});

// One screen and one mouse, so the app cannot tell which of the people in the room reached for
// SNIPE — the button stays live for everybody, including the player on turn, and until now nothing
// on screen said whose shot it actually was. Hot-seat only: online the button is simply dead for
// the seat that may not press it, which says it without words.
test.describe('SNIPE, in hot-seat, says whose it is', () => {
	test('names the one other player when there is only one', async ({ page, goToPlay }) => {
		await goToPlay(2);

		await expect(page.locator('#turn-player')).toHaveText('FEDE');
		await expect(page.locator('#snipe-note')).toHaveText("SARA's shot");
	});

	test('names the one who may not, when naming the rest would be a list', async ({ page, goToPlay }) => {
		// The seat count is the form's, not goToPlay's — same as the six-player spec in responsive.
		await page.click('#players3');
		await goToPlay(3);

		await expect(page.locator('#turn-player')).toHaveText('FEDE');
		await expect(page.locator('#snipe-note')).toHaveText('anyone but FEDE');
	});

	test('follows the turn', async ({ page, goToPlay, clickOn }) => {
		await goToPlay(2);

		await clickOn.team(0).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(0, 1);
		await page.click('#next-turn');

		await expect(page.locator('#turn-player')).toHaveText('SARA');
		await expect(page.locator('#snipe-note')).toHaveText("FEDE's shot");
	});

	// And follows the shot rather than the turn once there is one, which is the whole point of
	// saying it: the player being answered has already handed the turn on.
	test('stays with the player being answered after they pass the turn', async ({ page, goToPlay, clickOn }) => {
		await goToPlay(2);

		await clickOn.team(1).agent(1);
		await clickOn.cell(3, 1);
		await clickOn.cell(3, 2);

		await page.click('#next-turn');

		await clickOn.team(0).sniper();
		await clickOn.cell(3, 3);
		await clickOn.cell(3, 2);

		await page.click('#next-turn');

		await clickOn.team(1).agent(1);
		await clickOn.cell(3, 3);
		await clickOn.cell(3, 3);

		await page.click('#next-turn');

		await expect(page.locator('#turn-player')).toHaveText('SARA');
		await expect(page.locator('#snipe-note')).toHaveText("SARA's shot");
	});
});
