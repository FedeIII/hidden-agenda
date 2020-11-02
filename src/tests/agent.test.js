import { goToPlay } from './helpers/navigation.js';
import clickOn from './helpers/clickOn';
import get, { DIRECTION } from './helpers/get';

describe('Agent', () => {
  beforeEach(async () => {
    await goToPlay(2);
  });

	it('can be placed in the board', async () => {
		await clickOn.team(0).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);

		const pieceId = await get.pieceIn(1, 1).id;
		expect(pieceId).toEqual('pz-0-A1');

		const pieceDirection = await get.pieceIn(1, 1).direction;
		expect(pieceDirection).toEqual(DIRECTION.down.right);
	});

	it('can be placed in the border of the board', async () => {
		await clickOn.team(0).agent(1);
		await clickOn.cell(0, 0);
		await clickOn.cell(1, 1);

		const pieceId = await get.pieceIn(0, 0).id;
		expect(pieceId).toEqual('pz-0-A1');

		const pieceDirection = await get.pieceIn(0, 0).direction;
		expect(pieceDirection).toEqual(DIRECTION.down.right);
	});

	it('can be placed in the border of the board facing outwards', async () => {
		await clickOn.team(0).agent(1);
		await clickOn.cell(0, 0);
		await clickOn.cell(-1, -1);

		const pieceId = await get.pieceIn(0, 0).id;
		expect(pieceId).toEqual('pz-0-A1');

		const pieceDirection = await get.pieceIn(0, 0).direction;
		expect(pieceDirection).toEqual(DIRECTION.up.left);
	});

	it('can NOT be placed in cell with another piece', async () => {
		await clickOn.team(0).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).agent(2);
		await clickOn.cell(1, 1);

		const firstStoredPieceId = await get.pieceIn.store(0).id;
		expect(firstStoredPieceId).toEqual('pz-0-A2');

		const isHighlighted = await get.cell(1, 1).isHighlighted;
		expect(isHighlighted).toBeFalsy();
  });

  it('can be placed directed towards any direction', async () => {
		await clickOn.team(0).agent(1);
    await clickOn.cell(1, 1);
		await clickOn.cell(0, 1);

		await page.click('#next-turn');

		await clickOn.team(0).agent(2);
		await clickOn.cell(1, 2);
    await clickOn.cell(1, 3);
    
    await page.click('#next-turn');

		await clickOn.team(0).agent(3);
		await clickOn.cell(1, 3);
    await clickOn.cell(2, 4);
    
    await page.click('#next-turn');

		await clickOn.team(0).agent(4);
		await clickOn.cell(2, 1);
    await clickOn.cell(3, 1);
    
    await page.click('#next-turn');

		await clickOn.team(0).agent(5);
		await clickOn.cell(2, 2);
    await clickOn.cell(2, 1);
    
    await page.click('#next-turn');

		await clickOn.team(1).agent(1);
		await clickOn.cell(2, 3);
    await clickOn.cell(1, 2);
    
    const direction1 = get.pieceIn(1, 1).direction;
    const direction2 = get.pieceIn(1, 2).direction;
    const direction3 = get.pieceIn(1, 3).direction;
    const direction4 = get.pieceIn(2, 1).direction;
    const direction5 = get.pieceIn(2, 2).direction;
    const direction6 = get.pieceIn(2, 3).direction;

    expect(await direction1).toEqual(DIRECTION.up.right);
    expect(await direction2).toEqual(DIRECTION.right);
    expect(await direction3).toEqual(DIRECTION.down.right);
    expect(await direction4).toEqual(DIRECTION.down.left);
    expect(await direction5).toEqual(DIRECTION.left);
    expect(await direction6).toEqual(DIRECTION.up.left);
  });
  
  it('moves two cells in front of it', async () => {
		await clickOn.team(0).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).agent(1);

		const isNextCellHighlighted = get.cell(2, 2).isHighlighted;
    const is2NextCellsHighlighted = get.cell(3, 3).isHighlighted;
    
    expect(await isNextCellHighlighted).toBeFalsy();
		expect(await is2NextCellsHighlighted).toBeTruthy();
	});

	it('can NOT move if there is a piece in the next cell', async () => {
		await clickOn.team(1).agent(1);
		await clickOn.cell(2, 2);
		await clickOn.cell(3, 3);

		await page.click('#next-turn');

		await clickOn.team(0).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).agent(1);
		await clickOn.cell(2, 2);

		const pieceId = await get.pieceIn(1, 1).id;
		expect(pieceId).toEqual('pz-0-A1');

		const isNextCellHighlighted = get.cell(2, 2).isHighlighted;
    const is2NextCellsHighlighted = get.cell(3, 3).isHighlighted;
    
		expect(await isNextCellHighlighted).toBeFalsy();
		expect(await is2NextCellsHighlighted).toBeFalsy();
  });

  describe('direction after moving', () => {
    beforeEach(async () => {
      await clickOn.team(0).agent(1);
      await clickOn.cell(1, 1);
      await clickOn.cell(2, 2);

      await page.click('#next-turn');
    });

    it('can face straight', async () => {
      await clickOn.team(0).agent(1);

      await clickOn.cell(3, 3);
      await clickOn.cell(4, 3);

      const direction = await get.pieceIn(3, 3).direction;
      expect(direction).toEqual(DIRECTION.down.right);
    });

    it('can face left angle', async () => {
      await clickOn.team(0).agent(1);

      await clickOn.cell(3, 3);
      await clickOn.cell(3, 4);

      const direction = await get.pieceIn(3, 3).direction;
      expect(direction).toEqual(DIRECTION.right);
    });

    it('can face right angle', async () => {
      await clickOn.team(0).agent(1);

      await clickOn.cell(3, 3);
      await clickOn.cell(4, 2);

      const direction = await get.pieceIn(3, 3).direction;
      expect(direction).toEqual(DIRECTION.down.left);
    });

    it('can NOT face backwards', async () => {
      await clickOn.team(0).agent(1);

      await clickOn.cell(3, 3);
      await clickOn.cell(2, 2);

      const direction = await get.pieceIn(3, 3).direction;
      expect(direction).not.toEqual(DIRECTION.up.left);
    });

    it('can NOT face backwards left angle', async () => {
      await clickOn.team(0).agent(1);

      await clickOn.cell(3, 3);
      await clickOn.cell(3, 2);

      const direction = await get.pieceIn(3, 3).direction;
      expect(direction).not.toEqual(DIRECTION.left);
    });

    it('can NOT face backwards right angle', async () => {
      await clickOn.team(0).agent(1);

      await clickOn.cell(3, 3);
      await clickOn.cell(2, 3);

      const direction = await get.pieceIn(3, 3).direction;
      expect(direction).not.toEqual(DIRECTION.up.right);
    });
  });

	it('can kill if there is a piece 2 cells in front of it', async () => {
		await clickOn.team(1).agent(1);
		await clickOn.cell(3, 3);
		await clickOn.cell(4, 3);

		await page.click('#next-turn');

		await clickOn.team(0).agent(1);
		await clickOn.cell(1, 1);
		await clickOn.cell(2, 2);

		await page.click('#next-turn');

		await clickOn.team(0).agent(1);
		await clickOn.cell(3, 3);

		const pieceId = await get.pieceIn(3, 3).id;
		expect(pieceId).toEqual('pz-0-A1');

		const agentCount = await get.cementery(0).agent;
		expect(agentCount).not.toEqual('x1');
	});

	it('can return to any position except the same when moving outside the board', async () => {
		await clickOn.team(1).agent(1);
		await clickOn.cell(5, 3);
		await clickOn.cell(6, 3);

		await page.click('#next-turn');

		await clickOn.team(1).agent(1);

		const is00Highlighted = get.cell(0, 0).isHighlighted;
		const is12Highlighted = get.cell(1, 2).isHighlighted;
		const is03Highlighted = get.cell(0, 3).isHighlighted;
		const is31Highlighted = get.cell(3, 1).isHighlighted;
		const is44Highlighted = get.cell(4, 4).isHighlighted;
		const is61Highlighted = get.cell(6, 1).isHighlighted;

		const is53Highlighted = get.cell(5, 3).isHighlighted;

		expect(await is00Highlighted).toBeTruthy();
		expect(await is12Highlighted).toBeTruthy();
		expect(await is03Highlighted).toBeTruthy();
		expect(await is31Highlighted).toBeTruthy();
		expect(await is44Highlighted).toBeTruthy();
		expect(await is61Highlighted).toBeTruthy();

		expect(await is53Highlighted).toBeFalsy();
  });

  describe('CEO buff', () => {
    beforeEach(async () => {
      await clickOn.team(0).ceo();
      await clickOn.cell(0, 0);
      await clickOn.cell(1, 1);

      await page.click('#next-turn');
    });

    it('moves one OR two cells in front of it', async () => {
      await clickOn.team(0).agent(1);
      await clickOn.cell(1, 1);
      await clickOn.cell(2, 2);
  
      await page.click('#next-turn');
  
      await clickOn.team(0).agent(1);
  
      const isNextCellHighlighted = get.cell(2, 2).isHighlighted;
      const is2NextCellsHighlighted = get.cell(3, 3).isHighlighted;
      
      expect(await isNextCellHighlighted).toBeTruthy();
      expect(await is2NextCellsHighlighted).toBeTruthy();
    });

    it('can kill a piece right in front of it', async () => {
      await clickOn.team(1).agent(1);
      await clickOn.cell(2, 2);
      await clickOn.cell(3, 3);

      await page.click('#next-turn');

      await clickOn.team(0).agent(1);
      await clickOn.cell(1, 1);
      await clickOn.cell(2, 2);

      await page.click('#next-turn');

      await clickOn.team(0).agent(1);
      await clickOn.cell(2, 2);

      const pieceId = await get.pieceIn(2, 2).id;
      expect(pieceId).toEqual('pz-0-A1');

      const agentCount = await get.cementery(0).agent;
		  expect(agentCount).not.toEqual('x1');
    });
  });
});
