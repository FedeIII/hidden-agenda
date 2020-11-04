import { goToPlay } from './helpers/navigation.js';
import clickOn from './helpers/clickOn';
import get, { DIRECTION } from './helpers/get';

describe('SPY', () => {
	beforeEach(async () => {
		await goToPlay(2);
	});

	it('can be placed in the board', async () => {
		await clickOn.team(0).spy();
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);

		const pieceId = await get.pieceIn(1, 1).id;
		expect(pieceId).toEqual('pz-0-S');

		const pieceDirection = await get.pieceIn(1, 1).direction;
		expect(pieceDirection).toEqual(DIRECTION.down.right);
	});

	it('can be placed in the border of the board', async () => {
		await clickOn.team(0).spy();
		await clickOn.cell(0, 0);
		await clickOn.cell(1, 1);

		const pieceId = await get.pieceIn(0, 0).id;
		expect(pieceId).toEqual('pz-0-S');

		const pieceDirection = await get.pieceIn(0, 0).direction;
		expect(pieceDirection).toEqual(DIRECTION.down.right);
	});

	it('can be placed in the border of the board facing outwards', async () => {
		await clickOn.team(0).spy();
		await clickOn.cell(0, 0);
		await clickOn.cell(-1, -1);

		const pieceId = await get.pieceIn(0, 0).id;
		expect(pieceId).toEqual('pz-0-S');

		const pieceDirection = await get.pieceIn(0, 0).direction;
		expect(pieceDirection).toEqual(DIRECTION.up.left);
	});

	it('can NOT be placed in cell with another piece', async () => {
		await clickOn.team(0).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).spy();
		await clickOn.cell(1, 1);

		const firstStoredPieceId = await get.pieceIn(1, 1).id;
		expect(firstStoredPieceId).toEqual('pz-0-A1');

		const isHighlighted = await get.cell(1, 1).isHighlighted;
		expect(isHighlighted).toBeFalsy();
	});

	it('can be placed directed towards any direction', async () => {
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

	it('firstly moves one cell in any direction', async () => {
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

	it('secondly moves another cell in any direction', async () => {
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

	it('stays in the moving direction after moving', async () => {
		await clickOn.team(0).spy();
		await clickOn.cell(2, 2);
		await clickOn.cell(3, 3);

		await page.click('#next-turn');

		await clickOn.team(0).spy();
		await clickOn.cell(3, 3);
		await clickOn.cell(3, 2);

		let direction = await get.pieceIn(3, 2).direction;
		expect(direction).toEqual(DIRECTION.left);

		await clickOn.team(0).spy();
		await page.click('#next-turn');

		await clickOn.team(0).spy();
		await clickOn.cell(4, 2);
		await clickOn.cell(3, 3);

		direction = await get.pieceIn(3, 3).direction;
		expect(direction).toEqual(DIRECTION.up.right);
	});

	it('can NOT move if there is a piece in the next cell', async () => {
		await clickOn.team(1).agent(1);
		await clickOn.cell(2, 2);
		await clickOn.cell(1, 1);

		await page.click('#next-turn');

		await clickOn.team(0).spy();
		await clickOn.cell(3, 3);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).spy(1);
		await clickOn.cell(2, 2);

		const pieceId = await get.pieceIn(2, 2).id;
		expect(pieceId).toEqual('pz-1-A1');

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

	describe('kill', () => {
		it('can kill if the enemy piece is in the second movement cell AND the spy comes from the back', async () => {
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

		it('can kill if the enemy piece is in the second movement cell AND the spy comes from the back-left', async () => {
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

		it('can kill if the enemy piece is in the second movement cell AND the spy comes from the back-right', async () => {
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

		it('can NOT kill if the enemy piece is in the second movement cell BUT the spy comes from the front', async () => {
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

		it('can NOT kill if the enemy piece is in the second movement cell BUT the spy comes from the front-left', async () => {
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

		it('can NOT kill if the enemy piece is in the second movement cell BUT the spy comes from the right-left', async () => {
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
    
    it('can NOT kill if the piece is from the same team', async () => {
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

	describe('CEO buff', () => {
		beforeEach(async () => {
			await clickOn.team(0).ceo();
			await clickOn.cell(1, 1);
			await clickOn.cell(2, 2);

			await page.click('#next-turn');
		});

		it('moves 3 cells', async () => {
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

		it('does NOT kill on the first cell', async () => {
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

		it('does NOT kill on the second cell', async () => {
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

		it('kills on the third cell', async () => {
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

		it('does NOT move 3 cells if the CEO is next to the SPY after the first move', async () => {
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
