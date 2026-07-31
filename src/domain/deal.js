// Dealing the hidden friend/foe alignments. Pure and injectable so the server can own it
// (each player must only ever learn their own two cards) and so it can be tested.
//
// This used to live in alignmentPhase as two module-level arrays spliced in place, which meant
// a second game in the same page load started from a depleted deck.

const TEAMS = ['0', '1', '2', '3'];
const COPIES_PER_TEAM = 2;

function createDeck() {
	return TEAMS.reduce((deck, team) => deck.concat(Array(COPIES_PER_TEAM).fill(team)), []);
}

// Draws uniformly from the cards that are not `excluded`, which is what the original
// put-it-back-and-retry loop amounted to — minus its ability to spin forever when every
// remaining card is the excluded one.
function draw(deck, excluded, rng) {
	const eligible = deck.filter(card => card !== excluded);
	const pool = eligible.length ? eligible : deck;
	const card = pool[Math.floor(rng() * pool.length)];

	deck.splice(deck.indexOf(card), 1);

	return card;
}

export function dealAlignments(playerNames, rng = Math.random) {
	const friends = createDeck();
	const foes = createDeck();

	return playerNames.map(name => {
		const friend = draw(friends, undefined, rng);
		const foe = draw(foes, friend, rng);

		return { name, friend, foe };
	});
}

export default { dealAlignments };
