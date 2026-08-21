import { Button } from 'Client/components/button';
import useSession from 'Hooks/useSession';
import useT from 'Client/i18n';

// The way out of a room, wherever a player needs one: the waiting room, the board, the score table.
//
// It renders nothing at all in a hot-seat game, the same way the skin picker renders nothing for a
// player who may not change the skin. There is no room to leave — the game is the tab it is in — and
// offering the button anyway would be offering something that cannot happen.
//
// What it costs depends on where it is pressed, which is why the caller decides whether to confirm
// rather than this component: leaving a waiting room costs nothing (the code still gets you back in),
// and leaving a game that has been dealt is final, because a started room takes no new seats.
// `label` is a prop rather than one key, because the word depends on what is being left: a room, a
// game, or the seat at a board. The bare `LEAVE` on the action bar is the default, so the two
// callers who want it say nothing.
function LeaveGame({ id = 'leave-game', label, small = true, onClick }) {
	const { mode, actions } = useSession();
	const t = useT();

	if (mode !== 'online') {
		return null;
	}

	return (
		<Button id={id} small={small} active onClick={onClick || actions.leave}>
			{label || t('play.leave')}
		</Button>
	);
}

export default LeaveGame;
