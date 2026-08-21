// Every string the interface says, in the language it was written in.
//
// English is also the fallback, so this file is the inventory: a key that is not here is a key
// `t()` will hand back raw, and a key here that `es.js` is missing shows the English sentence.
// `src/tests/unit/i18n.test.js` holds the two files to the same shape.
//
// Keys are grouped by where they are read, not by what they say, because that is how they are
// looked up when a screen changes. `{name}`-style placeholders are filled by the caller.
//
// What is deliberately NOT here:
//
// - The rule book and the training course. Both are content rather than chrome — paragraphs, lists,
//   captions, a table — so they keep the shape they are authored in and live beside their own
//   language: `rules/content.{en,es}.js` and `training/exercises.es.js`.
// - The three skins' wording (`CONTROL:`, `SECTION A–A`). That is a skin's voice as much as a
//   language's, so it is a token, and `theme/tokens.js` carries a pair per skin.
// - Room names, player names and team indices. A drawn room name is a name, and translating it
//   would mean two tables looking at a list that does not agree.

export default {
	// The brand. Present as a key so a screen never hard-codes it, and identical in both
	// catalogs — a game called something else in Spanish would be a different game.
	app: {
		title: 'Hidden Agenda',
		loading: 'Loading the game…',
	},

	common: {
		mainMenu: 'Main Menu',
		index: 'Index',
		back: '‹ Back',
		cancel: 'CANCEL',
		backToBoard: 'BACK TO THE BOARD',
		// Appended to a player's own name in a list. The leading space is part of the string
		// because where it goes is the translator's business: Spanish wants it too, but a
		// language that suffixes without one should not have to fight the markup for it.
		you: ' (you)',
	},

	// The four teams, which are colours. `TEAM_NAMES` in `domain/teams.js` stays the English
	// record — the server-facing constant — and this is what a player reads.
	team: {
		0: 'BLACK',
		1: 'RED',
		2: 'WHITE',
		3: 'YELLOW',
	},

	// Friend and foe: the word on the card, the word in a sentence, and what each one does to a
	// score. Two cases rather than one lowercased at the point of use, because casing is a
	// language's own rule and `toLowerCase()` on a translated word is a guess.
	alignment: {
		friend: {
			card: 'Friend',
			word: 'friend',
			note: 'their points are yours',
		},
		foe: {
			card: 'Foe',
			word: 'foe',
			note: 'their points come off yours',
		},
	},

	language: {
		label: 'Language',
		// The tab face: short enough to sit on a file tab at nine pixels.
		short: { en: 'EN', es: 'ES' },
		// Spoken by a screen reader, and the tooltip. Each language names itself, in itself —
		// which is why both catalogs carry the same pair.
		name: { en: 'English', es: 'Español' },
	},

	skin: {
		label: 'Style',
		dossier: 'dossier',
		blueprint: 'blueprint',
		vault: 'vault',
	},

	connection: {
		connecting: 'Connecting…',
		reconnecting: 'Connection lost — reconnecting…',
		displaced: 'This seat is open in another window — play there, or reload here to take it back.',
	},

	lobby: {
		connecting: 'Connecting…',
		reconnecting: 'Reconnecting…',

		yourName: 'Your name',
		namePlaceholder: 'NAME',
		verifyHuman: "Verify you're human",
		turnstileHint: 'Complete the check to continue.',
		lastGame: 'Last game: {sign}{delta} — you are on {after}.',

		caseFile: 'Case File',
		howToPlay: 'How to Play',
		startAGame: 'START A GAME',
		joinAGame: 'JOIN A GAME',
		hotSeatInstead: 'PLAY HOT-SEAT INSTEAD',
		noServer: 'No server answered. Hot-seat plays in this tab and needs none.',

		startTitle: 'Start a game',
		joinTitle: 'Join a game',

		automatch: 'Automatch',
		findMeAGame: 'FIND ME A GAME',
		searching: 'Searching — {waiting} waiting',
		searchingRating: ', you are on {rating}',
		searchingAnyRating: ', any rating',
		needName: 'Say who you are first.',

		newRoom: 'New room',
		roomNamePlaceholder: 'ROOM NAME',
		reroll: '↻',
		listed: 'Listed',
		public: 'Public',
		private: 'Private',
		createRoom: 'NEW ROOM',
		privateHint: 'A private room is found by its code alone.',

		findARoom: 'Find a room',
		searchPlaceholder: 'SEARCH BY NAME',
		roomsOffline: 'The room list needs a server to ask.',
		noRoomsNamed: 'No public room by that name.',
		noRoomsYet: 'No public rooms yet. Open one.',
		showingSome: 'Showing {shown} of {total}. Search to narrow it.',

		orJoinByCode: 'Or join by code',
		codePlaceholder: 'CODE',
		join: 'JOIN',

		inAGame: 'You are in a game',
		// What a row in the room list says about itself. `lobby` and `started` are the server's
		// own two room states; the other two are this browser's relationship to the room.
		roomState: {
			lobby: 'lobby',
			started: 'started',
			yours: 'yours',
			resume: 'resume',
		},

		room: 'Room',
		privateRoom: 'Private room',
		roomCode: 'Room code',
		players: 'Players ({count}/{max})',
		host: 'host',
		offline: ' offline',
		start: 'START',
		waitingForHost: 'Waiting for the host to start…',
		leaveRoom: 'LEAVE ROOM',
		needMorePlayers: 'At least {min} players are needed.',

		// Why the server said no. Keyed by the code it sends, so the wire carries a reason and
		// never a sentence — which is also what lets the same refusal read in two languages.
		reason: {
			no_such_room: 'No room with that code.',
			room_full: 'That room is full.',
			name_taken: 'Somebody in that room already has that name.',
			room_already_started: 'That game has already started.',
			not_enough_players: 'Wait for at least {min} players.',
			seat_lost: 'Your seat is gone. Join again with a name.',
			server_full: 'The server is at its room limit. Try again shortly.',
			slow_down: 'Too many attempts. Wait a moment.',
			not_host: 'Only the player who made the room can start it.',
			skin_locked: 'The style cannot be changed once the game has started.',
			bad_skin: 'No such style.',
			bad_room_name: 'A room name is letters, digits, spaces and hyphens.',
			already_seated: 'You are already at a table.',
			bad_turnstile: 'Bot check failed. Try again.',
			left_alone: 'Everybody else left, so the game ended.',
			// The one refusal that comes with a number, and the fallback for when it arrives
			// without one.
			quit_timeout: 'You left a game in progress. You can play again in {wait}.',
			quit_timeout_vague: 'You left a game in progress. Wait a moment before starting another.',
		},
		// `30s` and `5 min`, as the units they are counted in.
		waitSeconds: '{seconds}s',
		waitMinutes: '{minutes} min',
	},

	// The hot-seat name form, which is the whole of setting a one-screen game up.
	start: {
		numberOfPlayers: '1. NUMBER OF PLAYERS',
		players: '2. PLAYERS',
		player: 'PLAYER {n}',
		getAlignments: 'GET ALIGNMENTS',
		playOnlineInstead: 'PLAY ONLINE INSTEAD',
	},

	// Handing the cards round, on one screen or on six.
	alignmentPhase: {
		onlyForEyes: "This is only for {name}'s eyes",
		expose: 'Expose your alignments',
		allReady: 'You are all ready to start!',
		nextPlayer: 'NEXT PLAYER',
		start: 'START',
		waitingForTable: 'Waiting for the table…',
		theseAreYours: '{name}, these are yours',
		nobodyElseSees: 'Nobody else can see them',
		ready: 'READY',
		waiting: 'WAITING…',
		readyCount: '{ready}/{total} ready',
	},

	play: {
		// The strip above the board.
		onTheDeskOf: 'on the desk of',
		ceosDown: 'ceos down',
		nextTurn: 'NEXT TURN',

		// The action bar.
		snipe: 'SNIPE!',
		standDown: 'STAND DOWN',
		accuse: 'ACCUSE',
		reveal: 'REVEAL',
		friendFoe: 'FRIEND & FOE',
		leave: 'LEAVE',

		// An HQ card's foot. The words either side of the holder's name are a skin token, because
		// which words they are is the skin's business — see theme/tokens.js.
		claim: 'CLAIM',
		cancelClaim: 'CANCEL',
		// The swatch on an alignment card: a colour reference, the way a file would carry one.
		teamRef: 'team {team}',
	},

	accuseScreen: {
		title: 'Accuse a player',
		verdictTitle: 'Your accusation',
		whom: 'Accuse whom?',
		cost: 'a wrong guess costs you that accusation for the rest of the game',
		nothingPublic: 'nothing public yet',
		knownFriend: 'friend: {team}',
		knownFoe: 'foe: {team}',
		whichAlignment: "{name}'s what?",
		blockedFriend: 'you guessed a friend wrong already',
		blockedFoe: 'you guessed a foe wrong already',
		blockedPublic: 'already public',
		whichTeamFriend: "{name}'s friend is which team?",
		whichTeamFoe: "{name}'s foe is which team?",
		correct: 'Correct',
		wrong: 'Wrong',
		detailFriendYes: "{name}'s friend is {team}",
		detailFriendNo: "{name}'s friend is not {team}",
		detailFoeYes: "{name}'s foe is {team}",
		detailFoeNo: "{name}'s foe is not {team}",
		costCorrect: 'it is public now, and it cost {name} {points} points',
		costWrongFriend: 'you may never accuse a friend again',
		costWrongFoe: 'you may never accuse a foe again',
	},

	revealScreen: {
		title: 'Reveal an alignment',
		bothTitle: 'Both are public now',
		note: 'costs {points} points, and hands you that team at once',
		bothNote: 'nothing left to give away',
		spent: '−{points} points spent on revealing',
		revealNothing: 'REVEAL NOTHING',
	},

	// Your own two cards, and the table read as a score.
	friendFoeScreen: {
		title: 'Your friend and foe',
		onlyForEyes: "only for {name}'s eyes",
		nobodyElseSees: 'nobody else can see these',
		isLooking: '{name} IS LOOKING',
		putItAway: 'PUT IT AWAY',
		on: 'on',
		withheld: 'withheld',
		revealed: 'revealed',
		accusedBy: 'accused by {name}',
		baseNote:
			'everyone is on {base} · an alignment becoming public costs its owner {cost} · the teams are counted at the end',
	},

	leaveScreen: {
		title: 'Leave the game',
		leaveTitle: 'Leave the game?',
		endTitle: 'End the game?',
		strandsNote: 'a game needs {min}, so the last player leaves with you',
		carriesOnNote: 'the game carries on without you',
		strandsCost: 'nobody scores, and the room is gone',
		noWayBackCost: 'a started room takes no new seats, so there is no way back',
		ratingCost: 'counts as a loss, and the next game waits on a timer',
		endIt: 'END IT',
		leave: 'LEAVE',
	},

	end: {
		points: 'pts',
		killed: 'Killed:',
		survivors: 'Survivors:',
		winner: 'Winner: ',
		leaveGame: 'LEAVE GAME',
	},

	// The rule book's own chrome. Its pages are content and live in rules/content.{en,es}.js.
	rules: {
		howToPlay: 'How to Play',
		intro:
			"Everybody moves everybody's pieces. Only two cards, held in secret, say whose side you are really on. Here is the whole game, in plain words — pick a page, or read it start to finish.",
		exerciseCount: '{count} exercises',
		learnByPlaying: 'Learn by Playing',
		learnTeaser: 'Almost nothing to read. Click your way through it.',
		// Two lines on a stamp, broken where the stamp is narrowest.
		trainingStampTop: 'Field',
		trainingStampBottom: 'Training',
		cheatSheetTitle: 'Cheat Sheet',
		cheatSheetTeaser: 'Every rule, one screen, no scrolling',
		figure: 'Fig. {n}',
		lightboxHint: 'Esc or click outside to close',
		ceoBuff: 'CEO Buff',
		missingPage: "That page isn't here",
		backTo: 'Back to {title}',
		onTo: 'On to {title}',
	},

	// The course's chrome. Its exercises' own words live beside the boards they belong to.
	training: {
		fieldTraining: 'Field Training',
		exerciseOf: 'Exercise {n} of {total}',
		// The two tabs that say which half of the screen is which. `liveBoard` is on the mat that
		// holds the real game; the folder above it holds the course.
		liveBoard: 'Live board',
		yourCards: 'Your cards',
		matNote: 'Click what is ringed',
		record: 'Record',
		startOver: 'Start over',
		step: 'Step {n} / {total}',
		passed: 'Passed',
		readTheFile: 'Read the file',
		next: 'Next ›',
		finish: 'Finish ›',
		cleared: 'Cleared',
		wholeGame: 'That is the whole board game.',
		pagesLeft: 'Two pages left to read',
		playNow: 'Play now',
		backToIndex: 'Back to the index',
		classified: 'Classified',
		cardOfTwo: 'Card {n} of 2',
		lineOfFire: 'line of fire',
	},
};
