import { test, expect, DIRECTION } from './fixtures';

test.describe('SPY', () => {
	test.beforeEach(async ({ page, clickOn, get, drag, goToPlay }) => {
		await goToPlay(2);
	});

	test('can be placed in the board', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).spy();
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);

		const pieceId = await get.pieceIn(1, 1).id;
		expect(pieceId).toEqual('pz-0-S');

		const pieceDirection = await get.pieceIn(1, 1).direction;
		expect(pieceDirection).toEqual(DIRECTION.down.right);
	});

	test('can be placed in the border of the board', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).spy();
		await clickOn.cell(0, 0);
		await clickOn.cell(1, 1);

		const pieceId = await get.pieceIn(0, 0).id;
		expect(pieceId).toEqual('pz-0-S');

		const pieceDirection = await get.pieceIn(0, 0).direction;
		expect(pieceDirection).toEqual(DIRECTION.down.right);
	});

	test('can be placed in the border of the board facing outwards', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).spy();
		await clickOn.cell(0, 0);
		await clickOn.cell(-1, -1);

		const pieceId = await get.pieceIn(0, 0).id;
		expect(pieceId).toEqual('pz-0-S');

		const pieceDirection = await get.pieceIn(0, 0).direction;
		expect(pieceDirection).toEqual(DIRECTION.up.left);
	});

	test('can NOT be placed in cell with another piece', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).spy();

		const isHighlighted = await get.cell(1, 1).isHighlighted;
		expect(isHighlighted).toBeFalsy();
	});

	test('can be placed directed towards any direction', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).spy();
		await clickOn.cell(1, 1);
		await clickOn.cell(0, 1);

		await page.click('#next-turn');

		await clickOn.team(1).spy();
		await clickOn.cell(1, 2);
		await clickOn.cell(1, 3);

		await page.click('#next-turn');

		await clickOn.team(2).spy();
		await clickOn.cell(1, 3);
		await clickOn.cell(2, 4);

		await page.click('#next-turn');

		await clickOn.team(3).spy();
		await clickOn.cell(2, 1);
		await clickOn.cell(3, 1);

		const direction1 = await get.pieceIn(1, 1).direction;
		const direction2 = await get.pieceIn(1, 2).direction;
		const direction3 = await get.pieceIn(1, 3).direction;
		const direction4 = await get.pieceIn(2, 1).direction;

		expect(direction1).toEqual(DIRECTION.up.right);
		expect(direction2).toEqual(DIRECTION.right);
		expect(direction3).toEqual(DIRECTION.down.right);
		expect(direction4).toEqual(DIRECTION.down.left);
	});

	test('firstly moves one cell in any direction', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).spy();
		await clickOn.cell(3, 3);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).spy();

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

		expect(cellAround1).toBeTruthy();
		expect(cellAround2).toBeTruthy();
		expect(cellAround3).toBeTruthy();
		expect(cellAround4).toBeTruthy();
		expect(cellAround5).toBeTruthy();
		expect(cellAround6).toBeTruthy();

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

	test('secondly moves another cell in any direction', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).spy();
		await clickOn.cell(2, 2);
		await clickOn.cell(3, 3);

		await page.click('#next-turn');

		await clickOn.team(0).spy();
		await clickOn.cell(3, 3);

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

		expect(cellAround1).toBeTruthy();
		expect(cellAround2).toBeTruthy();
		expect(cellAround3).toBeTruthy();
		expect(cellAround4).toBeTruthy();
		expect(cellAround5).toBeTruthy();
		expect(cellAround6).toBeTruthy();

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

	// Which colour the second step is drawn in is a look; that it is marked, that the mark is not
	// red, and that a cell out of reach carries none at all is the rule. Nothing previewed is a
	// legal cell, which is why isHighlighted — the literal red — stays false for every one of them.
	test('shows where its second move could get to, in a mark of its own', async ({
		page,
		clickOn,
		get,
		drag,
		goToPlay,
	}) => {
		await clickOn.team(0).spy();
		await clickOn.cell(3, 3);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).spy();

		const now = await get.cell(2, 2).highlightMark;
		const later = await get.cell(3, 5).highlightMark;
		const never = await get.cell(0, 0).highlightMark;

		expect(now).toEqual('2px solid rgb(255, 0, 0)');
		expect(later).not.toEqual('');
		expect(later).not.toEqual(now);
		expect(never).toEqual('');

		expect(await get.cell(3, 5).isHighlighted).toBeFalsy();
	});

	test('stops showing the walk ahead on its last move', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).spy();
		await clickOn.cell(3, 3);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).spy();
		await clickOn.cell(3, 4);

		expect(await get.cell(3, 5).isHighlighted).toBeTruthy();
		expect(await get.cell(3, 6).highlightMark).toEqual('');
	});

	test('can NOT be deselected during movement', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).spy();
		await clickOn.cell(2, 2);
		await clickOn.cell(3, 3);

		await page.click('#next-turn');

		await clickOn.team(0).spy();
		await clickOn.cell(3, 3);

		await clickOn.team(0).spy();
		await clickOn.team(0).spy();

		expect(await get.pieceIn(3, 3).isHighlighted).toBeTruthy();
		expect(await get.cell(4, 3).isHighlighted).toBeTruthy();
	});

	test('stays in the moving direction after moving', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(0).spy();
		await clickOn.cell(2, 2);
		await clickOn.cell(3, 3);

		await page.click('#next-turn');

		await clickOn.team(0).spy();
		await clickOn.cell(3, 3);
		await clickOn.cell(3, 2);

		let direction = await get.pieceIn(3, 2).direction;
		expect(direction).toEqual(DIRECTION.left);

		// No drop: the last step is what puts it down.
		await page.click('#next-turn');

		await clickOn.team(0).spy();
		await clickOn.cell(4, 2);
		await clickOn.cell(3, 3);

		direction = await get.pieceIn(3, 3).direction;
		expect(direction).toEqual(DIRECTION.up.right);
	});

	// Its two moves are enough to leave a cell and come back to it, and the return leg sets the
	// facing. Arrive the way you came and the board is untouched, which is not a turn — so the
	// steps are spent, the spy is back on the board and it can simply be picked up and walked
	// again. There is no drop to make here: its last step is what puts it down.
	test('does NOT end the turn when it walks back onto its own cell facing the same way', async ({
		page,
		clickOn,
		get,
	}) => {
		await clickOn.team(0).spy();
		await clickOn.cell(3, 3);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).spy();
		await clickOn.cell(4, 3);
		await clickOn.cell(3, 3);

		const pieceId = await get.pieceIn(3, 3).id;
		expect(pieceId).toEqual('pz-0-S');

		const direction = await get.pieceIn(3, 3).direction;
		expect(direction).toEqual(DIRECTION.up.left);

		const isNextTurnActive = await get.nextTurn.isActive;
		expect(isNextTurnActive).toBeFalsy();

		// And picking it up again is a fresh walk, not a piece stuck mid-move.
		await clickOn.team(0).spy();
		expect(await get.cell(3, 2).isHighlighted).toBeTruthy();
	});

	test('does end the turn when it walks back onto its own cell facing a new way', async ({ page, clickOn, get }) => {
		await clickOn.team(0).spy();
		await clickOn.cell(3, 3);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).spy();
		await clickOn.cell(3, 2);
		await clickOn.cell(3, 3);

		const direction = await get.pieceIn(3, 3).direction;
		expect(direction).toEqual(DIRECTION.right);

		const isNextTurnActive = await get.nextTurn.isActive;
		expect(isNextTurnActive).toBeTruthy();
	});

	// A spy has no turning step: the step it just took IS its facing, so its last one both points
	// it and puts it down. Nothing is left in hand and the turn is over.
	test('settles where it lands, with nothing left to point', async ({ page, clickOn, get }) => {
		await clickOn.team(0).spy();
		await clickOn.cell(3, 3);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).spy();
		await clickOn.cell(3, 4);
		await clickOn.cell(3, 5);

		expect(await get.pieceIn(3, 5).isHighlighted).toBeFalsy();
		expect(await get.pieceIn(3, 5).direction).toEqual(DIRECTION.right);
		expect(await get.nextTurn.isActive).toBeTruthy();

		// Settled means settled: clicking it again neither picks it up nor gives it more steps.
		await clickOn.team(0).spy();
		expect(await get.pieceIn(3, 5).isHighlighted).toBeFalsy();
		expect(await get.cell(3, 6).isHighlighted).toBeFalsy();
	});

	// The exception, and the reason isSettledByMove asks about the position it came from: a spy out
	// of an HQ lands with no facing of its own, so it is pointed and put down like everything else.
	test('is still pointed by hand when it comes out of its HQ', async ({ page, clickOn, get }) => {
		await clickOn.team(0).spy();
		await clickOn.cell(3, 3);

		expect(await get.pieceIn(3, 3).isHighlighted).toBeTruthy();
		expect(await get.nextTurn.isActive).toBeFalsy();

		await clickOn.cell(2, 2);

		expect(await get.pieceIn(3, 3).direction).toEqual(DIRECTION.up.left);
		expect(await get.nextTurn.isActive).toBeTruthy();
	});

	test('can NOT move if there is a piece in the next cell', async ({ page, clickOn, get, drag, goToPlay }) => {
		await clickOn.team(1).agent(1);
		await clickOn.cell(2, 2);
		await clickOn.cell(1, 1);

		await page.click('#next-turn');

		await clickOn.team(0).spy();
		await clickOn.cell(3, 3);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).spy(1);

		const isCell22Highlighted = await get.cell(2, 2).isHighlighted;
		const isCell23Highlighted = await get.cell(2, 3).isHighlighted;
		const isCell32Highlighted = await get.cell(3, 2).isHighlighted;
		const isCell34Highlighted = await get.cell(3, 4).isHighlighted;
		const isCell42Highlighted = await get.cell(4, 2).isHighlighted;
		const isCell43Highlighted = await get.cell(4, 3).isHighlighted;

		expect(isCell22Highlighted).toBeFalsy();

		expect(isCell23Highlighted).toBeTruthy();
		expect(isCell32Highlighted).toBeTruthy();
		expect(isCell34Highlighted).toBeTruthy();
		expect(isCell42Highlighted).toBeTruthy();
		expect(isCell43Highlighted).toBeTruthy();
	});

	test.describe('kill', () => {
		test('can kill if the enemy piece is in the second movement cell AND the spy comes from the back', async ({
			page,
			clickOn,
			get,
			drag,
			goToPlay,
		}) => {
			await clickOn.team(1).agent(1);
			await clickOn.cell(1, 1);
			await clickOn.cell(0, 0);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(3, 3);
			await clickOn.cell(2, 2);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(2, 2);
			await clickOn.cell(1, 1);

			const pieceId = await get.pieceIn(1, 1).id;
			expect(pieceId).toEqual('pz-0-S');

			const agentCount = await get.cementery(0).agent;
			expect(agentCount).toEqual('x 1');
		});

		test('can kill if the enemy piece is in the second movement cell AND the spy comes from the back-left', async ({
			page,
			clickOn,
			get,
			drag,
			goToPlay,
		}) => {
			await clickOn.team(1).agent(1);
			await clickOn.cell(1, 2);
			await clickOn.cell(0, 1);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(3, 3);
			await clickOn.cell(2, 2);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(2, 2);
			await clickOn.cell(1, 2);

			const pieceId = await get.pieceIn(1, 2).id;
			expect(pieceId).toEqual('pz-0-S');

			const agentCount = await get.cementery(0).agent;
			expect(agentCount).toEqual('x 1');
		});

		test('can kill if the enemy piece is in the second movement cell AND the spy comes from the back-right', async ({
			page,
			clickOn,
			get,
			drag,
			goToPlay,
		}) => {
			await clickOn.team(1).agent(1);
			await clickOn.cell(1, 2);
			await clickOn.cell(0, 2);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(3, 3);
			await clickOn.cell(2, 2);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(2, 3);
			await clickOn.cell(1, 2);

			const pieceId = await get.pieceIn(1, 2).id;
			expect(pieceId).toEqual('pz-0-S');

			const agentCount = await get.cementery(0).agent;
			expect(agentCount).toEqual('x 1');
		});

		test('can NOT kill if the enemy piece is in the second movement cell BUT the spy comes from the front', async ({
			page,
			clickOn,
			get,
			drag,
			goToPlay,
		}) => {
			await clickOn.team(1).agent(1);
			await clickOn.cell(1, 1);
			await clickOn.cell(2, 2);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(3, 3);
			await clickOn.cell(2, 2);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(2, 2);
			await clickOn.cell(1, 1);

			const pieceId = await get.pieceIn(1, 1).id;
			expect(pieceId).toEqual('pz-1-A1');
		});

		test('can NOT kill if the enemy piece is in the second movement cell BUT the spy comes from the front-left', async ({
			page,
			clickOn,
			get,
			drag,
			goToPlay,
		}) => {
			await clickOn.team(1).agent(1);
			await clickOn.cell(1, 2);
			await clickOn.cell(2, 2);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(3, 3);
			await clickOn.cell(2, 2);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(2, 3);
			await clickOn.cell(1, 2);

			const pieceId = await get.pieceIn(1, 2).id;
			expect(pieceId).toEqual('pz-1-A1');
		});

		test('can NOT kill if the enemy piece is in the second movement cell BUT the spy comes from the right-left', async ({
			page,
			clickOn,
			get,
			drag,
			goToPlay,
		}) => {
			await clickOn.team(1).agent(1);
			await clickOn.cell(1, 2);
			await clickOn.cell(2, 3);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(3, 3);
			await clickOn.cell(2, 2);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(2, 2);
			await clickOn.cell(1, 2);

			const pieceId = await get.pieceIn(1, 2).id;
			expect(pieceId).toEqual('pz-1-A1');
		});

		test('can NOT kill if the piece is from the same team', async ({ page, clickOn, get, drag, goToPlay }) => {
			await clickOn.team(0).agent(1);
			await clickOn.cell(1, 1);
			await clickOn.cell(0, 0);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(3, 3);
			await clickOn.cell(2, 2);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(2, 2);
			await clickOn.cell(1, 1);

			const pieceId = await get.pieceIn(1, 1).id;
			expect(pieceId).toEqual('pz-0-A1');
		});
	});

	test.describe('CEO buff', () => {
		test.beforeEach(async ({ page, clickOn, get, drag, goToPlay }) => {
			await clickOn.team(0).ceo();
			await clickOn.cell(1, 1);
			await clickOn.cell(2, 2);

			await page.click('#next-turn');
		});

		// Regression: another spy's walk used to leave the piece state machine on MOVEMENT2, and a
		// buffed spy picked up after it inherited two steps it had never taken — so it moved once
		// and settled. The state machine belongs to whatever is in hand, and nothing was.
		test('moves 3 cells even after another spy has walked', async ({ page, clickOn, get, drag, goToPlay }) => {
			// The buffed spy has to be on the board already: deploying it would take the state
			// machine through PLACEMENT and clear the very thing this is about.
			await clickOn.team(0).spy();
			await clickOn.cell(2, 2);
			await clickOn.cell(3, 3);

			await page.click('#next-turn');

			await clickOn.team(1).spy();
			await clickOn.cell(5, 3);
			await clickOn.cell(6, 3);

			await page.click('#next-turn');

			// Somebody else's two-step walk, which is what leaves MOVEMENT2 behind.
			await clickOn.team(1).spy();
			await clickOn.cell(5, 2);
			await clickOn.cell(5, 1);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(3, 3);
			await clickOn.cell(4, 3);
			await clickOn.cell(5, 3);

			expect(await get.pieceIn(5, 3).id).toEqual('pz-0-S');
		});

		test('moves 3 cells', async ({ page, clickOn, get, drag, goToPlay }) => {
			await clickOn.team(0).spy();
			await clickOn.cell(2, 2);
			await clickOn.cell(3, 3);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(3, 3);
			await clickOn.cell(4, 3);
			await clickOn.cell(5, 3);

			const pieceId = await get.pieceIn(5, 3).id;
			expect(pieceId).toEqual('pz-0-S');
		});

		test('settles on the third step, not the second', async ({ page, clickOn, get, drag, goToPlay }) => {
			await clickOn.team(0).spy();
			await clickOn.cell(2, 2);
			await clickOn.cell(3, 3);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(3, 3);
			await clickOn.cell(4, 3);

			// Two steps in and still in hand, because a buff buys a third.
			expect(await get.pieceIn(4, 3).isHighlighted).toBeTruthy();
			expect(await get.nextTurn.isActive).toBeFalsy();

			await clickOn.cell(5, 3);

			expect(await get.pieceIn(5, 3).isHighlighted).toBeFalsy();
			expect(await get.nextTurn.isActive).toBeTruthy();
		});

		test('can NOT be deselected during movement', async ({ page, clickOn, get, drag, goToPlay }) => {
			await clickOn.team(0).spy();
			await clickOn.cell(2, 2);
			await clickOn.cell(3, 3);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(3, 3);

			// No NEXT TURN here. A buffed spy has three moves and has taken one, so the turn has not
			// ended — this used to be a click on a button whose handler refused it, which read as a step
			// and did nothing. It surfaced the moment an inactive control became genuinely disabled.
			await clickOn.cell(4, 3);

			await clickOn.team(0).spy();
			await clickOn.team(0).spy();

			expect(await get.pieceIn(4, 3).isHighlighted).toBeTruthy();
			expect(await get.cell(5, 3).isHighlighted).toBeTruthy();
		});

		test('does NOT kill on the first cell', async ({ page, clickOn, get, drag, goToPlay }) => {
			await clickOn.team(1).agent(1);
			await clickOn.cell(3, 3);
			await clickOn.cell(4, 3);

			await clickOn.team(0).spy();
			await clickOn.cell(2, 2);
			await clickOn.cell(3, 3);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(3, 3);

			const pieceId = await get.pieceIn(3, 3).id;
			expect(pieceId).toEqual('pz-1-A1');
		});

		test('does NOT kill on the second cell', async ({ page, clickOn, get, drag, goToPlay }) => {
			await clickOn.team(1).agent(1);
			await clickOn.cell(4, 3);
			await clickOn.cell(5, 3);

			await clickOn.team(0).spy();
			await clickOn.cell(2, 2);
			await clickOn.cell(3, 3);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(3, 3);
			await clickOn.cell(4, 3);

			const pieceId = await get.pieceIn(4, 3).id;
			expect(pieceId).toEqual('pz-1-A1');
		});

		test('kills on the third cell', async ({ page, clickOn, get, drag, goToPlay }) => {
			await clickOn.team(1).agent(1);
			await clickOn.cell(5, 3);
			await clickOn.cell(6, 3);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(2, 2);
			await clickOn.cell(3, 3);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(3, 3);
			await clickOn.cell(4, 3);
			await clickOn.cell(5, 3);

			const pieceId = await get.pieceIn(5, 3).id;
			expect(pieceId).toEqual('pz-0-S');

			const agentCount = await get.cementery(0).agent;
			expect(agentCount).toEqual('x 1');
		});

		// Three moves, so two of them are still ahead and each is quieter than the one before it.
		test('shows both of the moves ahead, each with a mark of its own', async ({
			page,
			clickOn,
			get,
			drag,
			goToPlay,
		}) => {
			await clickOn.team(0).spy();
			await clickOn.cell(2, 2);
			await clickOn.cell(3, 3);

			await page.click('#next-turn');

			await clickOn.team(0).spy();

			const now = await get.cell(1, 2).highlightMark;
			const second = await get.cell(3, 4).highlightMark;
			const third = await get.cell(3, 5).highlightMark;

			// Three moves, three distinct marks — telling them apart is the whole point of giving
			// the later steps colours instead of one colour turned down twice.
			expect(now).toEqual('2px solid rgb(255, 0, 0)');
			expect(new Set([now, second, third]).size).toEqual(3);
			expect(second).not.toEqual('');
			expect(third).not.toEqual('');

			expect(await get.cell(6, 1).highlightMark).toEqual('');
		});

		test('does NOT move 3 cells if the CEO is next to the SPY after the first move', async ({
			page,
			clickOn,
			get,
			drag,
			goToPlay,
		}) => {
			await clickOn.team(0).spy();
			await clickOn.cell(0, 2);
			await clickOn.cell(1, 2);

			await page.click('#next-turn');

			await clickOn.team(0).spy();
			await clickOn.cell(1, 2);
			await clickOn.cell(2, 2);

			const pieceId = await get.pieceIn(2, 2).id;
			expect(pieceId).toEqual('pz-0-S');
		});
	});
});
