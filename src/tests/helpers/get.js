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

export default function createGet(page) {
	// Reading through a locator rather than page.$eval means playwright waits for the element
	// to exist instead of throwing on a board that has not rendered yet.
	const occupantOf = selector => page.locator(`${selector} > *`).first();

	const isBrightened = locator => locator.evaluate(el => getComputedStyle(el).filter === 'brightness(2)');

	return {
		pieceIn(row, cell) {
			const piece = occupantOf(`#hex-${row}-${cell}`);

			return {
				get id() {
					return piece.evaluate(el => el.id);
				},
				get direction() {
					return piece.evaluate(el => getComputedStyle(el).transform).then(normalizeMatrix);
				},
				get isHighlighted() {
					return isBrightened(piece);
				},
			};
		},

		cell(row, cell) {
			return {
				get isHighlighted() {
					return page
						.locator(`#hex-${row}-${cell}`)
						.evaluate(el => getComputedStyle(el)['border-left'] === '2px solid rgb(255, 0, 0)');
				},
				// The mark a cell is carrying, as its computed border, or '' for a cell with none.
				// `2px solid rgb(255, 0, 0)` is a legal destination; a spy's later steps each get a
				// colour of their own. Returned raw so a spec can say "distinct from red, and from
				// each other" — which is the rule — rather than pinning down which teal it is,
				// which is a look.
				get highlightMark() {
					return page.locator(`#hex-${row}-${cell}`).evaluate(el => {
						const border = getComputedStyle(el)['border-left'];

						return border.startsWith('2px solid ') ? border : '';
					});
				},
				get isEmpty() {
					return page
						.locator(`#hex-${row}-${cell} > *`)
						.count()
						.then(count => count === 0);
				},
			};
		},

		cementery(team) {
			const count = type => page.locator(`#piece-count-${team}-${type}`).innerText();

			return {
				get agent() {
					return count(AGENT);
				},
				get spy() {
					return count(SPY);
				},
				get sniper() {
					return count(SNIPER);
				},
				get ceo() {
					return count(CEO);
				},
			};
		},

		team(teamNumber) {
			return {
				agent(agentNumber) {
					return {
						get isHighlighted() {
							return isBrightened(page.locator(`#pz-${teamNumber}-${AGENT}${agentNumber}`));
						},
					};
				},
				ceo() {
					return {
						get isHighlighted() {
							return isBrightened(page.locator(`#pz-${teamNumber}-${CEO}`));
						},
					};
				},
			};
		},

		// The button is the only thing hasTurnEnded shows, and Button styles an inactive one with
		// a not-allowed cursor.
		get nextTurn() {
			return {
				get isActive() {
					return page.locator('#next-turn').evaluate(el => getComputedStyle(el).cursor === 'pointer');
				},
				// Whether it is asking to be pressed. The beat is opacity on a ::after, and the
				// animation NAME is styled-components', so what is asserted is that there is one —
				// the alternative would be pinning a hash. An inactive button has no ::after at all,
				// which computes to `none` on both counts.
				get isBeating() {
					return page.locator('#next-turn').evaluate(el => {
						const style = getComputedStyle(el, '::after');

						return style.animationName !== 'none' && style.content !== 'none';
					});
				},
			};
		},

		storedPieceIn(team) {
			return {
				get id() {
					return occupantOf(`#store-${team}`).evaluate(el => el.id);
				},
			};
		},
	};
}

export { DIRECTION };
