import { TYPES } from '../../domain/pieces/constants';

const { AGENT, SPY, SNIPER, CEO } = TYPES;

// page.click checks actionability first — the element must be visible with a stable bounding
// box — so the two races this suite used to work around by hand are handled for us.
export default function createClickOn(page) {
	return {
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
}
