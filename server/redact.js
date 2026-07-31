import { PHASES } from 'Domain/phases';

// THE file that protects the game's premise. A player must never learn another player's
// alignment, and the only durable way to guarantee that is to never serialise it: the server
// projects the state per recipient before it goes anywhere near a socket.
//
// Two ways an alignment legitimately becomes public:
//   - it is your own
//   - its owner has revealed it, which the game makes a deliberate, costly move
//
// And one whole-game exception: scoring needs every alignment (py.getPoints reads friend and
// foe for each player), so once the game is over there is nothing left to hide.

function redactAlignment(player, isOwn) {
	const { friend, foe } = player.alignment;
	const { friend: friendRevealed, foe: foeRevealed } = player.revealed;

	return {
		friend: isOwn || friendRevealed ? friend : null,
		foe: isOwn || foeRevealed ? foe : null,
	};
}

export function redactFor(seatName, state, phase) {
	// Game over: alignments are public, and the score table cannot be computed without them.
	if (phase === PHASES.END) {
		return state;
	}

	const { test: _test, ...visible } = state;

	return {
		...visible,
		players: state.players.map(player => ({
			...player,
			alignment: redactAlignment(player, player.name === seatName),
		})),
	};
}

// Used by the tests to assert the negative: that nothing recognisable as another seat's secret
// survives serialisation. Kept here so the rule and its check cannot drift apart.
export function alignmentsVisibleTo(seatName, state, phase) {
	return redactFor(seatName, state, phase).players.map(({ name, alignment }) => ({
		name,
		friend: alignment.friend,
		foe: alignment.foe,
	}));
}

export default redactFor;
