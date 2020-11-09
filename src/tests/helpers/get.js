import { TYPES } from '../../domain/pieces/constants';

const { AGENT, SPY, SNIPER, CEO } = TYPES;

const DIRECTION = {
	up: {
		right: 'matrix(0.866025, 0.5, -0.5, 0.866025, 0, 0)',
		left: 'matrix(0.866025, -0.5, 0.5, 0.866025, 0, 0)',
	},
	right: 'matrix(6.12323e-17, 1, -1, 6.12323e-17, 0, 0)',
	down: {
		right: 'matrix(-0.866025, 0.5, -0.5, -0.866025, 0, 0)',
		left: 'matrix(-0.866025, -0.5, 0.5, -0.866025, 0, 0)',
	},
	left: 'matrix(6.12323e-17, -1, 1, 6.12323e-17, 0, 0)',
};

const get = {
	pieceIn(row, cell) {
		return {
			get id() {
				return page.$eval(`#hex-${row}-${cell}`, el => el.children[0].id);
			},
			get direction() {
				return page.$eval(`#hex-${row}-${cell}`, el => getComputedStyle(el.children[0]).transform);
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
