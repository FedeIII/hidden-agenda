import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Buttons } from 'Client/components/button';
import { Title, Subtitle } from 'Client/components/title';
import Logo from 'Client/components/logo';
import useSession from 'Hooks/useSession';
import useTurnstile from 'Hooks/useTurnstile';
import useT from 'Client/i18n';
import SkinPicker from 'Client/components/skinPicker';
import LanguagePicker from 'Client/components/languagePicker';
import LeaveGame from 'Client/components/leaveGame';
import { MIN_PLAYERS, MAX_PLAYERS } from 'Domain/py';
import { ROOM_STATES } from 'Domain/phases';
import { isRoomNameShaped, MAX_ROOM_NAME_LENGTH, pickRoomName } from 'Domain/roomNames';
import { RulesIndex, RulePage } from './rules';
import { findRulePage } from './rules/content';
import TrainingCourse from './training';
import { EXERCISES, findExercise } from './training/exercises';
import {
	LobbyContainer,
	Panel,
	MenuList,
	RoomCode,
	ShareHint,
	SeatList,
	SeatRow,
	SeatMeta,
	SeatTag,
	Rating,
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
	TurnstileBox,
	TurnstileFooter,
	RulesTabButton,
	RulesTabEyebrow,
	RulesTabTitle,
} from './components';

// Long enough that typing a word is one request rather than six, short enough that the list has
// caught up by the time the hand leaves the keyboard.
const SEARCH_DEBOUNCE_MS = 200;

// The one refusal that comes with a number. Leaving a game in progress costs a wait before the next
// one, and it doubles each time — so saying "later" would be no answer at all, and saying "30 seconds"
// when it is really sixteen minutes would be worse.
function waitOut(t, seconds) {
	if (!Number.isFinite(seconds)) {
		return t('lobby.reason.quit_timeout_vague');
	}

	const minutes = Math.ceil(seconds / 60);
	const wait = seconds < 60 ? t('lobby.waitSeconds', { seconds }) : t('lobby.waitMinutes', { minutes });

	return t('lobby.reason.quit_timeout', { wait });
}

// Why the server said no. Every refusal arrives as a code — the wire never carries a sentence — so
// this is the one place a code becomes words, and the same refusal reads in whichever language the
// browser asking is set to. An unknown code falls back to itself rather than to nothing: a reason
// this build has never heard of is still better on screen than a blank notice.
function explain(t, reason, seconds = null) {
	if (reason === 'quit_timeout') {
		return waitOut(t, seconds);
	}

	const said = t(`lobby.reason.${reason}`, { min: MIN_PLAYERS });

	return said === `lobby.reason.${reason}` ? reason : said;
}

// Naming the room and deciding whether anybody may find it. The name field is never empty: it opens
// on a draw from the two word lists, so "mandatory" costs the player nothing unless they want it to.
function NewRoom({ canGo, onCreate }) {
	const t = useT();
	const [roomName, setRoomName] = useState(pickRoomName);
	const [isPublic, setIsPublic] = useState(true);

	const named = isRoomNameShaped(roomName);

	return (
		<Section>
			<Subtitle>{t('lobby.newRoom')}</Subtitle>
			<Row>
				{/* The drawn name is not translated. It is a name — what the table calls itself and
				    what a latecomer searches the list for — and two browsers looking at a list that
				    did not agree would be looking at two different lists. */}
				<Field
					id="lobby-room-name"
					value={roomName}
					maxLength={MAX_ROOM_NAME_LENGTH}
					placeholder={t('lobby.roomNamePlaceholder')}
					onChange={event => setRoomName(event.target.value)}
				/>
				{/* A re-roll rather than only a text field, because the draw is the point: most tables
				    want *a* name, not a particular one, and pressing this twice is faster than typing. */}
				<Button id="lobby-room-reroll" small active onClick={() => setRoomName(pickRoomName())}>
					{t('lobby.reroll')}
				</Button>
			</Row>

			<Choices id="lobby-visibility">
				<Hint>{t('lobby.listed')}</Hint>
				<Choice
					id="lobby-visibility-public"
					type="button"
					current={isPublic}
					aria-pressed={isPublic}
					onClick={() => setIsPublic(true)}
				>
					{t('lobby.public')}
				</Choice>
				<Choice
					id="lobby-visibility-private"
					type="button"
					current={!isPublic}
					aria-pressed={!isPublic}
					onClick={() => setIsPublic(false)}
				>
					{t('lobby.private')}
				</Choice>
			</Choices>

			<Buttons>
				<Button
					id="lobby-create"
					active={canGo && named}
					onClick={() => canGo && named && onCreate({ room: roomName.trim(), isPrivate: !isPublic })}
				>
					{t('lobby.createRoom')}
				</Button>
			</Buttons>

			{!named && <Notice id="lobby-room-name-bad">{explain(t, 'bad_room_name')}</Notice>}
			{!isPublic && <Notice id="lobby-private-hint">{t('lobby.privateHint')}</Notice>}
		</Section>
	);
}

// One room, as it appears in the list. Every value a spec reads sits in a data attribute rather than
// in the text, because what the text says is the skin's business — small caps here, and the row is
// free to abbreviate — while the count and the state are facts.
function Finder({ rooms, total, query, onQuery, canGo, held, onEnter, unreachable }) {
	const t = useT();

	return (
		<Section>
			<Subtitle>{t('lobby.findARoom')}</Subtitle>
			<Field
				id="lobby-search"
				value={query}
				maxLength={MAX_ROOM_NAME_LENGTH}
				placeholder={t('lobby.searchPlaceholder')}
				onChange={event => onQuery(event.target.value)}
			/>

			{/* An empty list and no server are different facts. On a build with nothing behind /ws —
			    the Pages one — "no public rooms yet, open one" would be a claim this screen cannot make
			    and an invitation to press a button that cannot work. */}
			{unreachable && <Notice id="lobby-rooms-offline">{t('lobby.roomsOffline')}</Notice>}

			{!unreachable && rooms.length === 0 && (
				<Notice id="lobby-rooms-empty">{t(query.trim() ? 'lobby.noRoomsNamed' : 'lobby.noRoomsYet')}</Notice>
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
									{...(Number.isFinite(room.rating) ? { 'data-room-rating': room.rating } : {})}
									onClick={() => onEnter(room.code)}
								>
									<RoomName>{room.name}</RoomName>
									<RoomMeta>
										<span>{room.host}</span>
										{/* What the table averages, so somebody scanning this list can see what they
										    would be walking into. Absent rather than zero for a room of browsers with
										    nothing to look up. */}
										{Number.isFinite(room.rating) && <Rating>{room.rating}</Rating>}
										<span>
											{room.players}/{MAX_PLAYERS}
										</span>
										<RoomState open={open}>
											{mine ? t('lobby.roomState.yours') : t(`lobby.roomState.${room.state}`)}
										</RoomState>
									</RoomMeta>
								</RoomRow>
							</li>
						);
					})}
				</RoomList>
			)}

			{/* A cap that is not reported reads as "that is every room". */}
			{total > rooms.length && (
				<Notice id="lobby-rooms-more">{t('lobby.showingSome', { shown: rooms.length, total })}</Notice>
			)}
			{rooms.length > 0 && !canGo && <Notice id="lobby-rooms-need-name">{t('lobby.needName')}</Notice>}
		</Section>
	);
}

// The seats this browser is still holding. A refresh keeps its room in the URL and needs none of
// this; arriving at the front door instead — a bookmark, a new tab, a laptop reopened — loses the
// hash, and without this the game you are in the middle of is invisible from the one screen that
// could take you back to it.
function Resume({ seats, onEnter }) {
	const t = useT();

	if (!seats.length) {
		return null;
	}

	return (
		<Section>
			<Subtitle>{t('lobby.inAGame')}</Subtitle>
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
								<RoomState open>{t('lobby.roomState.resume')}</RoomState>
							</RoomMeta>
						</RoomRow>
					</li>
				))}
			</RoomList>
		</Section>
	);
}

/**
 * Automatch: let the server pick the table.
 *
 * Deliberately not a different kind of game. A match makes an ordinary private room and seats
 * everybody in it, and the host still presses START — so what this replaces is finding a table, not
 * playing at one.
 */
function Automatch({ canGo, queue, onQueue, onCancel }) {
	const t = useT();
	const searching = Boolean(queue);

	return (
		<Section>
			<Subtitle>{t('lobby.automatch')}</Subtitle>
			<Row>
				<Button id="lobby-queue" small active={canGo || searching} onClick={searching ? onCancel : onQueue}>
					{t(searching ? 'common.cancel' : 'lobby.findMeAGame')}
				</Button>
				{searching && (
					<Hint id="lobby-queue-status" data-waiting={queue.waiting}>
						{/* The window is what the server is currently willing to match across, and it widens
						    on its own — so this is a push, not something the client could work out. Null is
						    the point at which it will take anybody. Three clauses rather than one sentence
						    with two optional halves: which of them are on depends on the queue, and a
						    language is free to join them its own way. */}
						{t('lobby.searching', { waiting: queue.waiting })}
						{Number.isFinite(queue.rating) ? t('lobby.searchingRating', { rating: queue.rating }) : ''}
						{queue.window === null ? t('lobby.searchingAnyRating') : ''}
					</Hint>
				)}
			</Row>
			{!canGo && !searching && <Notice id="lobby-queue-need-name">{t('lobby.needName')}</Notice>}
		</Section>
	);
}

/**
 * What the last game did to this browser's rating, on the screen the player lands on after it.
 *
 * Matched by the name this browser played under, because the frame carries names and the seat is gone
 * by the time this renders. Without it a walk-out's penalty would be invisible: nothing else on this
 * screen would mention that leaving had cost anything.
 */
function LastGame({ rated, playerName }) {
	const t = useT();
	const mine = rated?.players?.find(player => player.name === playerName);

	if (!mine || !mine.delta) {
		return null;
	}

	return (
		<Notice id="lobby-last-game" data-delta={mine.delta}>
			{t('lobby.lastGame', {
				sign: mine.delta > 0 ? '+' : '−',
				delta: Math.abs(mine.delta),
				after: mine.after,
			})}
		</Notice>
	);
}

// Where in the join screen this browser currently is. A plain three-way local state rather than
// anything in the session: the server has no opinion on it, and it is exactly the kind of thing that
// should reset to the front door the next time `JoinForm` mounts fresh — leaving a game, or arriving
// at the index for the first time — rather than survive across it.
const MENU = 'menu';
const START = 'start';
const JOIN = 'join';
const RULES = 'rules';
// A rule page is `rules:<slug>` — one string, so the rest of the component still only ever
// juggles a single piece of state, the same as it did with three fixed values.
const RULE_PREFIX = 'rules:';
// And a training exercise is `training:<slug>`, for the same reason and with the same shape. It is
// a real path rather than state inside the course so the browser's own back button steps through the
// exercises, and so one of them can be linked to on its own.
const TRAINING_PREFIX = 'training:';

// Each submenu gets a real path rather than being pure React state, so the browser's own back
// button — and a bookmark or a shared link straight into one — both work. `#/r/CODE` is the only
// other hash this app writes, and none of these can ever collide with its four-character code.
function hashFor(view) {
	if (view === START) {
		return '#/start';
	}

	if (view === JOIN) {
		return '#/join';
	}

	if (view === RULES) {
		return '#/rules';
	}

	if (view.startsWith(RULE_PREFIX)) {
		return `#/rules/${view.slice(RULE_PREFIX.length)}`;
	}

	if (view.startsWith(TRAINING_PREFIX)) {
		return `#/training/${view.slice(TRAINING_PREFIX.length)}`;
	}

	return '#/';
}

// `.game` is the scrollport, not the document. It is absolutely positioned over the whole viewport
// with `overflow-y: auto` (globalStyle.js), so the page behind it never scrolls at all and
// `window.scrollTo` — the obvious thing to reach for — does nothing whatsoever here.
//
// `scrollTop` rather than `scrollTo`, so it lands at the top rather than travelling there: a view
// change is not a movement within a page, and a skin is free to ask for smooth scrolling.
function scrollToTop() {
	const scrollport = document.querySelector('.game');

	if (scrollport) {
		scrollport.scrollTop = 0;
	}
}

function readMenuView() {
	const hash = window.location.hash;

	if (hash === '#/start') {
		return START;
	}

	if (hash === '#/join') {
		return JOIN;
	}

	if (hash === '#/rules') {
		return RULES;
	}

	const ruleMatch = /^#\/rules\/([a-z-]+)$/.exec(hash);

	// A slug that doesn't exist (an old link, a typo) is not a page — the front door is the
	// honest answer, not a page that renders nothing.
	if (ruleMatch && findRulePage(ruleMatch[1])) {
		return `${RULE_PREFIX}${ruleMatch[1]}`;
	}

	// `#/training` on its own is the first exercise, which is where the course starts anyway — so a
	// link with nothing after it lands somewhere rather than nowhere.
	const trainingMatch = /^#\/training(?:\/([a-z-]+))?$/.exec(hash);

	if (trainingMatch) {
		const slug = trainingMatch[1];

		if (!slug || findExercise(slug)) {
			return `${TRAINING_PREFIX}${slug || ''}`;
		}
	}

	return MENU;
}

function JoinForm({ session, unreachable }) {
	const t = useT();
	const { code, rooms, roomsTotal, resumable, playerName, queue, rated, error, turnstileRequired, actions } = session;
	// Pulled out as plain values because they are the effects' dependencies. `actions` itself is a new
	// object on every session update — it is spread with goOnline/goHotSeat — while the functions in it
	// come straight off the transport and never change, so depending on the object would re-run the
	// search on every frame the server pushes and ask for the list again each time.
	const { createRoom, joinRoom, listRooms, stopListing, queueUp, cancelQueue, goHotSeat } = actions;
	// Filled in with whatever this browser played under last. An initialiser rather than a value prop,
	// so it seeds the field and then gets out of the way: the player is free to type over it, and a name
	// arriving from the server mid-edit must not overwrite what they are typing.
	const [name, setName] = useState(() => playerName || '');
	const [roomCode, setRoomCode] = useState(code || '');
	const [query, setQuery] = useState('');
	// Read from the hash rather than always starting on MENU, so a reload or a shared link straight
	// into "Start a game" opens on it directly instead of bouncing through the front door first.
	const [view, setView] = useState(readMenuView);
	const settledHistory = useRef(false);

	// Absent entirely when the server is not enforcing one — a build with no server at all, or the
	// test server, which deliberately runs with none configured — so canGo below never waits on a
	// widget that would never be checked.
	const { containerRef: turnstileRef, token: turnstileToken, reset: resetTurnstile } = useTurnstile(turnstileRequired);

	const trimmed = name.trim();
	const canGo = trimmed.length > 0 && (!turnstileRequired || Boolean(turnstileToken));
	const held = new Set(resumable.map(seat => seat.code));

	// Debounced, and re-run on every change to the query — including the empty one on the way in,
	// which is what first opens the socket. Kept running regardless of which page is on screen: the
	// finder's own results should already be waiting the moment "Join a game" is opened.
	useEffect(() => {
		const timer = setTimeout(() => listRooms(query), SEARCH_DEBOUNCE_MS);

		return () => clearTimeout(timer);
	}, [query, listRooms]);

	// Nobody is looking at the list once this screen is gone, so a reconnect should not re-ask for it.
	useEffect(() => stopListing, [stopListing]);

	// A token is redeemed the moment the server accepts *or* refuses a create/join/queue that carried
	// it — every error on this screen follows an attempt that spent it, whatever it says — so any
	// refusal here means the next try needs a fresh solve, not just `bad_turnstile` itself.
	useEffect(() => {
		if (error) {
			resetTurnstile();
		}
	}, [error, resetTurnstile]);

	// Gives "back" somewhere to land even when this tab has no history of its own to fall back on —
	// a bookmark or a shared link opened straight into a submenu. Guarded by a ref rather than run
	// unconditionally: StrictMode mounts every effect twice in development, and pushState has no
	// cleanup that could undo a duplicate the way removing an event listener does, so an unguarded
	// version would leave two "start" entries in history and take two presses of back to clear.
	useEffect(() => {
		if (settledHistory.current) {
			return;
		}

		settledHistory.current = true;

		const initial = readMenuView();

		if (initial !== MENU) {
			window.history.replaceState(null, '', '#/');
			window.history.pushState(null, '', hashFor(initial));
		}
	}, []);

	// The browser's own back/forward buttons, which the pushes below make real history entries for.
	useEffect(() => {
		function onPopState() {
			setView(readMenuView());
		}

		window.addEventListener('popstate', onPopState);

		return () => window.removeEventListener('popstate', onPopState);
	}, []);

	// Escape is the keyboard's own "back", and only means something once there is somewhere to go
	// back to — the main menu has no parent within this screen for it to leave.
	useEffect(() => {
		if (view === MENU) {
			return undefined;
		}

		function onKeyDown(event) {
			if (event.key === 'Escape') {
				window.history.back();
			}
		}

		window.addEventListener('keydown', onKeyDown);

		return () => window.removeEventListener('keydown', onKeyDown);
	}, [view]);

	// One door for the finder, the resume list and the code field alike. The store turns it into a
	// rejoin when this browser holds a token for that room, which is what makes selecting a game you
	// are already in put you back in your seat instead of refusing you as a latecomer.
	const enter = useCallback(target => joinRoom(target, trimmed, turnstileToken), [joinRoom, trimmed, turnstileToken]);

	const create = useCallback(
		options => canGo && createRoom(trimmed, { ...options, turnstileToken }),
		[canGo, createRoom, trimmed, turnstileToken],
	);

	const joinByCode = useCallback(
		() => canGo && roomCode.trim().length === 4 && enter(roomCode.trim().toUpperCase()),
		[canGo, enter, roomCode],
	);

	// A real navigation each way, so the browser's own back button, this button and Escape are all
	// the same action rather than three that have to be kept in step by hand.
	//
	// And it starts at the top, which a browser does for free on a real page load and not at all
	// here: every view is the same mounted component with different props, so nothing touches the
	// scroll. Turning the page halfway down a rule left the reader at that same offset in the next
	// one — past its title, often past its picture, and on a phone that is most of the screen.
	const enterView = useCallback(next => {
		setView(next);
		window.history.pushState(null, '', hashFor(next));
		scrollToTop();
	}, []);

	const backToMenu = useCallback(() => window.history.back(), []);
	// Unlike the plain "back" everything else in this menu uses, the rules pages jump straight to
	// the main menu regardless of how many pages deep the reader has clicked through — leaving the
	// book behind is a bigger decision than stepping back one page, which Index already covers.
	const goToMainMenu = useCallback(() => enterView(MENU), [enterView]);

	if (view === RULES) {
		return (
			<RulesIndex
				onOpen={slug => enterView(`${RULE_PREFIX}${slug}`)}
				onTrain={() => enterView(`${TRAINING_PREFIX}${EXERCISES[0].slug}`)}
				onBack={goToMainMenu}
			/>
		);
	}

	if (view.startsWith(RULE_PREFIX)) {
		return (
			<RulePage
				slug={view.slice(RULE_PREFIX.length)}
				onOpen={slug => enterView(`${RULE_PREFIX}${slug}`)}
				onBack={goToMainMenu}
				onIndex={() => enterView(RULES)}
			/>
		);
	}

	if (view.startsWith(TRAINING_PREFIX)) {
		return (
			<TrainingCourse
				slug={view.slice(TRAINING_PREFIX.length)}
				onOpen={slug => enterView(`${TRAINING_PREFIX}${slug}`)}
				onOpenFile={slug => enterView(`${RULE_PREFIX}${slug}`)}
				onBack={goToMainMenu}
				onIndex={() => enterView(RULES)}
				onPlay={goHotSeat}
			/>
		);
	}

	if (view === START) {
		return (
			<Panel>
				<Buttons>
					<Button id="lobby-back" small active onClick={backToMenu}>
						{t('common.back')}
					</Button>
				</Buttons>
				<Subtitle>{t('lobby.startTitle')}</Subtitle>
				<Automatch
					canGo={canGo}
					queue={queue}
					onQueue={() => canGo && queueUp(trimmed, turnstileToken)}
					onCancel={cancelQueue}
				/>
				<NewRoom canGo={canGo} onCreate={create} />
			</Panel>
		);
	}

	if (view === JOIN) {
		return (
			<Panel>
				<Buttons>
					<Button id="lobby-back" small active onClick={backToMenu}>
						{t('common.back')}
					</Button>
				</Buttons>
				<Subtitle>{t('lobby.joinTitle')}</Subtitle>
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
					<Subtitle>{t('lobby.orJoinByCode')}</Subtitle>
					<Row>
						<Field
							id="lobby-code"
							code
							value={roomCode}
							maxLength={4}
							placeholder={t('lobby.codePlaceholder')}
							onChange={event => setRoomCode(event.target.value.toUpperCase())}
						/>
						<Button id="lobby-join" small active={canGo && roomCode.trim().length === 4} onClick={joinByCode}>
							{t('lobby.join')}
						</Button>
					</Row>
				</Section>
			</Panel>
		);
	}

	return (
		<Panel $footerGap={turnstileRequired}>
			<Subtitle>{t('lobby.yourName')}</Subtitle>
			<Field
				id="lobby-name"
				value={name}
				maxLength={16}
				placeholder={t('lobby.namePlaceholder')}
				onChange={event => setName(event.target.value.toUpperCase())}
			/>

			{turnstileRequired && (
				<TurnstileFooter>
					<Subtitle>{t('lobby.verifyHuman')}</Subtitle>
					<TurnstileBox id="lobby-turnstile" ref={turnstileRef} />
					{!turnstileToken && <Notice id="lobby-turnstile-hint">{t('lobby.turnstileHint')}</Notice>}
				</TurnstileFooter>
			)}

			<LastGame rated={rated} playerName={playerName} />

			<Resume seats={resumable} onEnter={enter} />

			{/* Its own tab rather than a fourth stamp in the list below — learning the game is a
			    different kind of choice than picking start-or-join, made before either. */}
			<RulesTabButton id="lobby-menu-rules" type="button" onClick={() => enterView(RULES)}>
				<RulesTabEyebrow>{t('lobby.caseFile')}</RulesTabEyebrow>
				<RulesTabTitle>{t('lobby.howToPlay')}</RulesTabTitle>
			</RulesTabButton>

			<Section>
				<MenuList>
					<Button id="lobby-menu-start" active onClick={() => enterView(START)}>
						{t('lobby.startAGame')}
					</Button>
					<Button id="lobby-menu-join" active onClick={() => enterView(JOIN)}>
						{t('lobby.joinAGame')}
					</Button>
					{/* A room is the game this is for. One screen passed around a table is the other way
					    to play it, and it needs nothing but this tab — which is also the answer when no
					    server answers. */}
					<Button id="play-hotseat-btn" small active onClick={goHotSeat}>
						{t('lobby.hotSeatInstead')}
					</Button>
				</MenuList>

				{unreachable && <Notice id="lobby-no-server">{t('lobby.noServer')}</Notice>}
			</Section>
		</Panel>
	);
}

function Seats({ seats, hostSeatId, seatId }) {
	const t = useT();

	return (
		<SeatList id="lobby-seats">
			{seats.map(seat => (
				// The rating goes in a data attribute as well as being shown, because what the row *says*
				// is the skin's business — `RoomMeta` next door is uppercased — while what a spec reads
				// has to be the number. A seat with no rating id carries no attribute at all rather than
				// an empty one, so "unrated" and "rated 0" cannot be confused.
				<SeatRow
					key={seat.id}
					dim={!seat.connected}
					id={`lobby-seat-${seat.name}`}
					{...(Number.isFinite(seat.rating) ? { 'data-rating': seat.rating } : {})}
				>
					<span>
						{seat.name}
						{seat.id === seatId ? t('common.you') : ''}
					</span>
					<SeatMeta>
						{Number.isFinite(seat.rating) && <Rating>{seat.rating}</Rating>}
						<SeatTag>
							{seat.id === hostSeatId ? t('lobby.host') : ''}
							{seat.connected ? '' : t('lobby.offline')}
						</SeatTag>
					</SeatMeta>
				</SeatRow>
			))}
		</SeatList>
	);
}

function WaitingRoom({ session }) {
	const t = useT();
	const { code, roomName, roomPrivate, seats, hostSeatId, seatId, actions } = session;
	const isHost = seatId && seatId === hostSeatId;
	const enough = seats.length >= MIN_PLAYERS;
	const shareUrl = `${window.location.origin}${window.location.pathname}#/r/${code}`;

	return (
		<Panel>
			{/* The name first, then the code. The name is what the table calls itself and what a
			    latecomer will search the list for; the code is what they will type. */}
			<Subtitle>{t(roomPrivate ? 'lobby.privateRoom' : 'lobby.room')}</Subtitle>
			<RoomTitle id="lobby-room-title">{roomName}</RoomTitle>

			<Subtitle>{t('lobby.roomCode')}</Subtitle>
			<RoomCode id="lobby-room-code">{code}</RoomCode>
			<ShareHint id="lobby-share">{shareUrl}</ShareHint>

			<Subtitle>{t('lobby.players', { count: seats.length, max: MAX_PLAYERS })}</Subtitle>
			<Seats seats={seats} hostSeatId={hostSeatId} seatId={seatId} />

			{/* Host only, and it renders nothing for anyone else. Changing it here re-dresses the
			    waiting room on every screen at once, which is the point: the table should be able to
			    see what it is about to play in. */}
			<SkinPicker />

			<Buttons>
				{isHost ? (
					<Button id="lobby-start" active={enough} onClick={actions.start}>
						{t('lobby.start')}
					</Button>
				) : (
					<Notice id="lobby-waiting">{t('lobby.waitingForHost')}</Notice>
				)}

				{/* No confirmation here, unlike leaving a game: the room stays, its code still joins it, and
				    the seat count everybody is looking at goes down by one. */}
				<LeaveGame id="lobby-leave" label={t('lobby.leaveRoom')} />
			</Buttons>

			{isHost && !enough && <Notice>{t('lobby.needMorePlayers', { min: MIN_PLAYERS })}</Notice>}
		</Panel>
	);
}

// This is the index now, so it is also where a player finds out there is no server to talk to — a
// build served off GitHub Pages has none at all, and neither does a laptop running the client without
// `./dev.sh`. Both look identical from here: a socket that will not open. Saying so beside the way out
// is the difference between a dead form and a choice.
function LobbyPhase() {
	const t = useT();
	const session = useSession();
	const { status, seatId, error, errorSeconds } = session;

	// A seat in this room means the waiting room; a code without a seat means somebody followed a
	// shared link and still has to say who they are.
	const seated = Boolean(seatId);
	const unreachable = status === 'reconnecting';

	return (
		<LobbyContainer>
			<Title>
				<Logo />
				{t('app.title')}
			</Title>

			{/* Under the title rather than tucked into one of the panels, because every screen the
			    lobby can show — the name form, start, join, the whole rule book and the training
			    course — is rendered below this line. A reader four pages into the file can switch
			    language and stay on the page they were reading. */}
			<LanguagePicker />

			{status === 'connecting' && <Notice id="lobby-connecting">{t('lobby.connecting')}</Notice>}
			{/* Only worth saying to somebody who has a seat to get back to. Unseated, the socket is open
			    for the room list alone, and "reconnecting" would be the first thing a player reads on a
			    build that has no server at all — where the useful sentence is the one below (moved into
			    JoinForm's own menu, alongside the hot-seat door it explains). */}
			{status === 'reconnecting' && seated && <Notice id="lobby-reconnecting">{t('lobby.reconnecting')}</Notice>}
			{error && (
				<Notice bad id="lobby-error">
					{explain(t, error, errorSeconds)}
				</Notice>
			)}

			{seated ? <WaitingRoom session={session} /> : <JoinForm session={session} unreachable={unreachable} />}
		</LobbyContainer>
	);
}

export default LobbyPhase;
