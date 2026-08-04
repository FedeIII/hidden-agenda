import { useCallback, useEffect, useState } from 'react';
import { Button, Buttons } from 'Client/components/button';
import { Title, Subtitle } from 'Client/components/title';
import useSession from 'Hooks/useSession';
import SkinPicker from 'Client/components/skinPicker';
import LeaveGame from 'Client/components/leaveGame';
import { MIN_PLAYERS, MAX_PLAYERS } from 'Domain/py';
import { ROOM_STATES } from 'Domain/phases';
import { isRoomNameShaped, MAX_ROOM_NAME_LENGTH, pickRoomName } from 'Domain/roomNames';
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
	Section,
	RoomList,
	RoomRow,
	RoomName,
	RoomTitle,
	RoomMeta,
	RoomState,
	Choices,
	Choice,
	Hint,
} from './components';

// Long enough that typing a word is one request rather than six, short enough that the list has
// caught up by the time the hand leaves the keyboard.
const SEARCH_DEBOUNCE_MS = 200;

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
	bad_room_name: 'A room name is letters, digits, spaces and hyphens.',
	// Not an error, and the only thing on this list that nobody did wrong. It is here because this is
	// where a player lands when the rest of the table walks out of a game they were in the middle of,
	// and arriving back at the lobby with no explanation reads as a bug.
	left_alone: 'Everybody else left, so the game ended.',
};

function explain(reason) {
	return REASONS[reason] || reason;
}

// Naming the room and deciding whether anybody may find it. The name field is never empty: it opens
// on a draw from the two word lists, so "mandatory" costs the player nothing unless they want it to.
function NewRoom({ canGo, onCreate }) {
	const [roomName, setRoomName] = useState(pickRoomName);
	const [isPublic, setIsPublic] = useState(true);

	const named = isRoomNameShaped(roomName);

	return (
		<Section>
			<Subtitle>New room</Subtitle>
			<Row>
				<Field
					id="lobby-room-name"
					value={roomName}
					maxLength={MAX_ROOM_NAME_LENGTH}
					placeholder="ROOM NAME"
					onChange={event => setRoomName(event.target.value)}
				/>
				{/* A re-roll rather than only a text field, because the draw is the point: most tables
				    want *a* name, not a particular one, and pressing this twice is faster than typing. */}
				<Button id="lobby-room-reroll" small active onClick={() => setRoomName(pickRoomName())}>
					↻
				</Button>
			</Row>

			<Choices id="lobby-visibility">
				<Hint>Listed</Hint>
				<Choice
					id="lobby-visibility-public"
					type="button"
					current={isPublic}
					aria-pressed={isPublic}
					onClick={() => setIsPublic(true)}
				>
					Public
				</Choice>
				<Choice
					id="lobby-visibility-private"
					type="button"
					current={!isPublic}
					aria-pressed={!isPublic}
					onClick={() => setIsPublic(false)}
				>
					Private
				</Choice>
			</Choices>

			<Buttons>
				<Button
					id="lobby-create"
					active={canGo && named}
					onClick={() => canGo && named && onCreate({ room: roomName.trim(), isPrivate: !isPublic })}
				>
					NEW ROOM
				</Button>
			</Buttons>

			{!named && <Notice id="lobby-room-name-bad">{explain('bad_room_name')}</Notice>}
			{!isPublic && <Notice id="lobby-private-hint">A private room is found by its code alone.</Notice>}
		</Section>
	);
}

// One room, as it appears in the list. Every value a spec reads sits in a data attribute rather than
// in the text, because what the text says is the skin's business — small caps here, and the row is
// free to abbreviate — while the count and the state are facts.
function Finder({ rooms, total, query, onQuery, canGo, held, onEnter, unreachable }) {
	return (
		<Section>
			<Subtitle>Find a room</Subtitle>
			<Field
				id="lobby-search"
				value={query}
				maxLength={MAX_ROOM_NAME_LENGTH}
				placeholder="SEARCH BY NAME"
				onChange={event => onQuery(event.target.value)}
			/>

			{/* An empty list and no server are different facts. On a build with nothing behind /ws —
			    the Pages one — "no public rooms yet, open one" would be a claim this screen cannot make
			    and an invitation to press a button that cannot work. */}
			{unreachable && <Notice id="lobby-rooms-offline">The room list needs a server to ask.</Notice>}

			{!unreachable && rooms.length === 0 && (
				<Notice id="lobby-rooms-empty">
					{query.trim() ? 'No public room by that name.' : 'No public rooms yet. Open one.'}
				</Notice>
			)}

			{rooms.length > 0 && (
				<RoomList id="lobby-rooms">
					{rooms.map(room => {
						const mine = held.has(room.code);
						const open = room.state === ROOM_STATES.LOBBY && room.players < MAX_PLAYERS;
						// A room you already hold a seat in is always reachable — that is a rejoin, and
						// it needs neither a free seat nor a name. Anything else needs all three.
						const joinable = mine || (open && canGo);

						return (
							<li key={room.code}>
								<RoomRow
									id={`lobby-room-${room.code}`}
									type="button"
									joinable={joinable}
									disabled={!joinable}
									data-room-name={room.name}
									data-room-host={room.host || ''}
									data-room-players={room.players}
									data-room-state={room.state}
									onClick={() => onEnter(room.code)}
								>
									<RoomName>{room.name}</RoomName>
									<RoomMeta>
										<span>{room.host}</span>
										<span>
											{room.players}/{MAX_PLAYERS}
										</span>
										<RoomState open={open}>{mine ? 'yours' : room.state}</RoomState>
									</RoomMeta>
								</RoomRow>
							</li>
						);
					})}
				</RoomList>
			)}

			{/* A cap that is not reported reads as "that is every room". */}
			{total > rooms.length && (
				<Notice id="lobby-rooms-more">
					Showing {rooms.length} of {total}. Search to narrow it.
				</Notice>
			)}
			{rooms.length > 0 && !canGo && <Notice id="lobby-rooms-need-name">Say who you are first.</Notice>}
		</Section>
	);
}

// The seats this browser is still holding. A refresh keeps its room in the URL and needs none of
// this; arriving at the front door instead — a bookmark, a new tab, a laptop reopened — loses the
// hash, and without this the game you are in the middle of is invisible from the one screen that
// could take you back to it.
function Resume({ seats, onEnter }) {
	if (!seats.length) {
		return null;
	}

	return (
		<Section>
			<Subtitle>You are in a game</Subtitle>
			<RoomList id="lobby-resume">
				{seats.map(seat => (
					<li key={seat.code}>
						<RoomRow
							id={`lobby-resume-${seat.code}`}
							type="button"
							joinable
							data-room-name={seat.room || seat.code}
							onClick={() => onEnter(seat.code)}
						>
							<RoomName>{seat.room || seat.code}</RoomName>
							<RoomMeta>
								<span>{seat.name}</span>
								<RoomState open>resume</RoomState>
							</RoomMeta>
						</RoomRow>
					</li>
				))}
			</RoomList>
		</Section>
	);
}

function JoinForm({ session, unreachable }) {
	const { code, rooms, roomsTotal, resumable, actions } = session;
	// Pulled out as plain values because they are the effects' dependencies. `actions` itself is a new
	// object on every session update — it is spread with goOnline/goHotSeat — while the functions in it
	// come straight off the transport and never change, so depending on the object would re-run the
	// search on every frame the server pushes and ask for the list again each time.
	const { createRoom, joinRoom, listRooms, stopListing } = actions;
	const [name, setName] = useState('');
	const [roomCode, setRoomCode] = useState(code || '');
	const [query, setQuery] = useState('');

	const trimmed = name.trim();
	const canGo = trimmed.length > 0;
	const held = new Set(resumable.map(seat => seat.code));

	// Debounced, and re-run on every change to the query — including the empty one on the way in,
	// which is what first opens the socket.
	useEffect(() => {
		const timer = setTimeout(() => listRooms(query), SEARCH_DEBOUNCE_MS);

		return () => clearTimeout(timer);
	}, [query, listRooms]);

	// Nobody is looking at the list once this screen is gone, so a reconnect should not re-ask for it.
	useEffect(() => stopListing, [stopListing]);

	// One door for the finder, the resume list and the code field alike. The store turns it into a
	// rejoin when this browser holds a token for that room, which is what makes selecting a game you
	// are already in put you back in your seat instead of refusing you as a latecomer.
	const enter = useCallback(target => joinRoom(target, trimmed), [joinRoom, trimmed]);

	const create = useCallback(options => canGo && createRoom(trimmed, options), [canGo, createRoom, trimmed]);

	const joinByCode = useCallback(
		() => canGo && roomCode.trim().length === 4 && enter(roomCode.trim().toUpperCase()),
		[canGo, enter, roomCode],
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

			<Resume seats={resumable} onEnter={enter} />

			<NewRoom canGo={canGo} onCreate={create} />

			<Finder
				rooms={rooms}
				total={roomsTotal}
				query={query}
				onQuery={setQuery}
				canGo={canGo}
				held={held}
				onEnter={enter}
				unreachable={unreachable}
			/>

			<Section>
				<Subtitle>Or join by code</Subtitle>
				<Row>
					<Field
						id="lobby-code"
						code
						value={roomCode}
						maxLength={4}
						placeholder="CODE"
						onChange={event => setRoomCode(event.target.value.toUpperCase())}
					/>
					<Button id="lobby-join" small active={canGo && roomCode.trim().length === 4} onClick={joinByCode}>
						JOIN
					</Button>
				</Row>
			</Section>
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
	const { code, roomName, roomPrivate, seats, hostSeatId, seatId, actions } = session;
	const isHost = seatId && seatId === hostSeatId;
	const enough = seats.length >= MIN_PLAYERS;
	const shareUrl = `${window.location.origin}${window.location.pathname}#/r/${code}`;

	return (
		<Panel>
			{/* The name first, then the code. The name is what the table calls itself and what a
			    latecomer will search the list for; the code is what they will type. */}
			<Subtitle>{roomPrivate ? 'Private room' : 'Room'}</Subtitle>
			<RoomTitle id="lobby-room-title">{roomName}</RoomTitle>

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

				{/* No confirmation here, unlike leaving a game: the room stays, its code still joins it, and
				    the seat count everybody is looking at goes down by one. */}
				<LeaveGame id="lobby-leave" label="LEAVE ROOM" />
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
	const { status, seatId, error, actions } = session;

	// A seat in this room means the waiting room; a code without a seat means somebody followed a
	// shared link and still has to say who they are.
	const seated = Boolean(seatId);
	const unreachable = status === 'reconnecting';

	return (
		<LobbyContainer>
			<Title>Hidden Agenda</Title>

			{status === 'connecting' && <Notice id="lobby-connecting">Connecting…</Notice>}
			{/* Only worth saying to somebody who has a seat to get back to. Unseated, the socket is open
			    for the room list alone, and "reconnecting" would be the first thing a player reads on a
			    build that has no server at all — where the useful sentence is the one below. */}
			{status === 'reconnecting' && seated && <Notice id="lobby-reconnecting">Reconnecting…</Notice>}
			{error && (
				<Notice bad id="lobby-error">
					{explain(error)}
				</Notice>
			)}

			{seated ? <WaitingRoom session={session} /> : <JoinForm session={session} unreachable={unreachable} />}

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
