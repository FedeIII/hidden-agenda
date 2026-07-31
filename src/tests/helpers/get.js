import { TYPES } from '../../domain/pieces/constants';

const { AGENT, SPY, SNIPER, CEO } = TYPES;

// Chrome used to report cos(90deg) as 6.12323e-17 and now reports exactly 0, which broke
// eight assertions across four specs. Compare on normalised numbers instead of on whatever
// float noise the current engine emits: clamp near-zero to 0 and round to 6 decimals.
function normalizeMatrix(transform) {
	return transform.replace(/-?\d+(\.\d+)?(e[-+]?\d+)?/g, match => {
		const value = parseFloat(match);
		return String(Math.abs(value) < 1e-6 ? 0 : Math.round(value * 1e6) / 1e6);
	});
}

const DIRECTION = {
	up: {
		right: 'matrix(0.866025, 0.5, -0.5, 0.866025, 0, 0)',
		left: 'matrix(0.866025, -0.5, 0.5, 0.866025, 0, 0)',
	},
	right: 'matrix(0, 1, -1, 0, 0, 0)',
	down: {
		right: 'matrix(-0.866025, 0.5, -0.5, -0.866025, 0, 0)',
		left: 'matrix(-0.866025, -0.5, 0.5, -0.866025, 0, 0)',
	},
	left: 'matrix(0, -1, 1, 0, 0, 0)',
};

const get = {
	pieceIn(row, cell) {
		return {
			get id() {
				return page.$eval(`#hex-${row}-${cell}`, el => el.children[0].id);
			},
			get direction() {
				return page
					.$eval(`#hex-${row}-${cell}`, el => getComputedStyle(el.children[0]).transform)
					.then(normalizeMatrix);
			},
			get isHighlighted() {
				return page.$eval(
					`#hex-${row}-${cell}`,
					el => getComputedStyle(el.children[0]).filter === 'brightness(2)',
				);
			},
		};
	},

	cell(row, cell) {
		return {
			get isHighlighted() {
				return page.$eval(
					`#hex-${row}-${cell}`,
					el => getComputedStyle(el)['border-left'] === '2px solid rgb(255, 0, 0)',
				);
			},
		};
	},

	cementery(team) {
		return {
			get agent() {
				return page.$eval(`#piece-count-${team}-${AGENT}`, el => el.innerText);
			},
			get spy() {
				return page.$eval(`#piece-count-${team}-${SPY}`, el => el.innerText);
			},
			get sniper() {
				return page.$eval(`#piece-count-${team}-${SNIPER}}`, el => el.innerText);
			},
			get ceo() {
				return page.$eval(`#piece-count-${team}-${CEO}`, el => el.innerText);
			},
		};
	},

	team(teamNumber) {
		return {
			agent(agentNumber) {
				return {
					get isHighlighted() {
						return page.$eval(
							`#pz-${teamNumber}-${AGENT}${agentNumber}`,
							el => getComputedStyle(el).filter === 'brightness(2)',
						);
					},
				};
			},
			ceo() {
				return {
					get isHighlighted() {
						return page.$eval(
							`#pz-${teamNumber}-${CEO}`,
							el => getComputedStyle(el).filter === 'brightness(2)',
						);
					},
				};
			},
		};
	},
};

get.pieceIn.store = function store(team) {
	return {
		get id() {
			return page.$eval(`#store-${team}`, el => el.children[0].id);
		},
	};
};

export default get;
export { DIRECTION };
