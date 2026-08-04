import { useCallback, useState } from 'react';
import { Button, Buttons } from 'Client/components/button';
import { Title, Subtitle } from 'Client/components/title';
import useSession from 'Hooks/useSession';
import SkinPicker from 'Client/components/skinPicker';
import { MIN_PLAYERS, MAX_PLAYERS } from 'Domain/py';
import {
	LobbyContainer,
	Panel,
	RoomCode,
	ShareHint,
	SeatList,
	SeatRow,
	SeatTag,
	Field,
	Row,
	Notice,
} from './components';

const REASONS = {
	no_such_room: 'No room with that code.',
	room_full: 'That room is full.',
	name_taken: 'Somebody in that room already has that name.',
	room_already_started: 'That game has already started.',
	not_enough_players: `Wait for at least ${MIN_PLAYERS} players.`,
	seat_lost: 'Your seat is gone. Join again with a name.',
	server_full: 'The server is at its room limit. Try again shortly.',
	slow_down: 'Too many attempts. Wait a moment.',
	not_host: 'Only the player who made the room can start it.',
	skin_locked: 'The style cannot be changed once the game has started.',
	bad_skin: 'No such style.',
};

function explain(reason) {
	return REASONS[reason] || reason;
}

function JoinForm({ code, onCreate, onJoin }) {
	const [name, setName] = useState('');
	const [roomCode, setRoomCode] = useState(code || '');

	const trimmed = name.trim();
	const canGo = trimmed.length > 0;

	const create = useCallback(() => canGo && onCreate(trimmed), [canGo, onCreate, trimmed]);
	const join = useCallback(
		() => canGo && roomCode.trim().length === 4 && onJoin(roomCode.trim().toUpperCase(), trimmed),
		[canGo, onJoin, roomCode, trimmed],
	);

	return (
		<Panel>
			<Subtitle>Your name</Subtitle>
			<Field
				id="lobby-name"
				value={name}
				maxLength={16}
				placeholder="NAME"
				onChange={event => setName(event.target.value.toUpperCase())}
			/>

			<Buttons>
				<Button id="lobby-create" active={canGo} onClick={create}>
					NEW ROOM
				</Button>
			</Buttons>

			<Subtitle>or join one</Subtitle>
			<Row>
				<Field
					id="lobby-code"
					code
					value={roomCode}
					maxLength={4}
					placeholder="CODE"
					onChange={event => setRoomCode(event.target.value.toUpperCase())}
				/>
				<Button id="lobby-join" small active={canGo && roomCode.trim().length === 4} onClick={join}>
					JOIN
				</Button>
			</Row>
		</Panel>
	);
}

function Seats({ seats, hostSeatId, seatId }) {
	return (
		<SeatList id="lobby-seats">
			{seats.map(seat => (
				<SeatRow key={seat.id} dim={!seat.connected} id={`lobby-seat-${seat.name}`}>
					<span>
						{seat.name}
						{seat.id === seatId ? ' (you)' : ''}
					</span>
					<SeatTag>
						{seat.id === hostSeatId ? 'host' : ''}
						{seat.connected ? '' : ' offline'}
					</SeatTag>
				</SeatRow>
			))}
		</SeatList>
	);
}

function WaitingRoom({ session }) {
	const { code, seats, hostSeatId, seatId, actions } = session;
	const isHost = seatId && seatId === hostSeatId;
	const enough = seats.length >= MIN_PLAYERS;
	const shareUrl = `${window.location.origin}${window.location.pathname}#/r/${code}`;

	return (
		<Panel>
			<Subtitle>Room code</Subtitle>
			<RoomCode id="lobby-room-code">{code}</RoomCode>
			<ShareHint id="lobby-share">{shareUrl}</ShareHint>

			<Subtitle>
				Players ({seats.length}/{MAX_PLAYERS})
			</Subtitle>
			<Seats seats={seats} hostSeatId={hostSeatId} seatId={seatId} />

			{/* Host only, and it renders nothing for anyone else. Changing it here re-dresses the
			    waiting room on every screen at once, which is the point: the table should be able to
			    see what it is about to play in. */}
			<SkinPicker />

			<Buttons>
				{isHost ? (
					<Button id="lobby-start" active={enough} onClick={actions.start}>
						START
					</Button>
				) : (
					<Notice id="lobby-waiting">Waiting for the host to start…</Notice>
				)}
			</Buttons>

			{isHost && !enough && <Notice>At least {MIN_PLAYERS} players are needed.</Notice>}
		</Panel>
	);
}

// This is the index now, so it is also where a player finds out there is no server to talk to — a
// build served off GitHub Pages has none at all, and neither does a laptop running the client without
// `./dev.sh`. Both look identical from here: a socket that will not open. Saying so beside the way out
// is the difference between a dead form and a choice.
function LobbyPhase() {
	const session = useSession();
	const { status, code, seatId, error, actions } = session;

	// A seat in this room means the waiting room; a code without a seat means somebody followed a
	// shared link and still has to say who they are.
	const seated = Boolean(seatId);
	const unreachable = status === 'reconnecting';

	return (
		<LobbyContainer>
			<Title>Hidden Agenda</Title>

			{status === 'connecting' && <Notice id="lobby-connecting">Connecting…</Notice>}
			{status === 'reconnecting' && <Notice id="lobby-reconnecting">Reconnecting…</Notice>}
			{error && (
				<Notice bad id="lobby-error">
					{explain(error)}
				</Notice>
			)}

			{seated ? (
				<WaitingRoom session={session} />
			) : (
				<JoinForm code={code} onCreate={actions.createRoom} onJoin={actions.joinRoom} />
			)}

			{/* A room is the game this is for. One screen passed around a table is the other way to play
			    it, and it needs nothing but this tab — which is also the answer when no server answers. */}
			{!seated && (
				<>
					<Buttons>
						<Button id="play-hotseat-btn" small active onClick={actions.goHotSeat}>
							PLAY HOT-SEAT INSTEAD
						</Button>
					</Buttons>

					{unreachable && (
						<Notice id="lobby-no-server">No server answered. Hot-seat plays in this tab and needs none.</Notice>
					)}
				</>
			)}
		</LobbyContainer>
	);
}

export default LobbyPhase;
