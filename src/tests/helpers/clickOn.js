import { TYPES } from '../../domain/pieces/constants';

const { AGENT, SPY, SNIPER, CEO } = TYPES;

const clickOn = {
	team(teamNumber) {
		return {
			async agent(agentNumber) {
				await page.click(`#pz-${teamNumber}-${AGENT}${agentNumber}`);
			},
			async spy() {
				await page.click(`#pz-${teamNumber}-${SPY}`);
			},
			async sniper() {
				await page.click(`#pz-${teamNumber}-${SNIPER}`);
			},
			async ceo() {
				await page.click(`#pz-${teamNumber}-${CEO}`);
			},
		};
	},
	async cell(row, cell) {
		await page.click(`#hex-${row}-${cell}`);
	},
};

export default clickOn;
