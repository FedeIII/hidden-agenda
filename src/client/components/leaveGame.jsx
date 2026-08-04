import { Button } from 'Client/components/button';
import useSession from 'Hooks/useSession';

// The way out of a room, wherever a player needs one: the waiting room, the board, the score table.
//
// It renders nothing at all in a hot-seat game, the same way the skin picker renders nothing for a
// player who may not change the skin. There is no room to leave — the game is the tab it is in — and
// offering the button anyway would be offering something that cannot happen.
//
// What it costs depends on where it is pressed, which is why the caller decides whether to confirm
// rather than this component: leaving a waiting room costs nothing (the code still gets you back in),
// and leaving a game that has been dealt is final, because a started room takes no new seats.
function LeaveGame({ id = 'leave-game', label = 'LEAVE', small = true, onClick }) {
	const { mode, actions } = useSession();

	if (mode !== 'online') {
		return null;
	}

	return (
		<Button id={id} small={small} active onClick={onClick || actions.leave}>
			{label}
		</Button>
	);
}

export default LeaveGame;
