// Every rule in the game, rewritten for a player rather than for a developer — short sentences,
// plain words, nothing you need to already know. RULES.md stays the developer-facing source of
// truth (it points at the code); this is the same rules, told the other way round.
//
// One page per topic, grouped for the index. `image` is optional — a page without one is one
// where the words alone carry it (there is nothing to point a camera at in a scoring formula).

export const GROUPS = [
	'The Basics',
	'Playing a Turn',
	'The Pieces',
	'Combat & Control',
	'Cards on the Table',
	'Winning',
];

export const RULES_PAGES = [
	{
		// No `group` — the cheat sheet is a featured button of its own on the index rather than a
		// card under any one topic, and its own layout (see `RulePage`) ignores `image`/`body`/`table`
		// entirely in favour of `cheatSheet`, a dense grid built to read at a glance rather than start
		// to finish. First in the array on purpose: no page before it, and "next" from here is the
		// start of the story proper.
		slug: 'cheat-sheet',
		title: 'Cheat Sheet',
		teaser: 'Every rule, one screen, no scrolling.',
		cheatSheet: [
			{
				heading: 'The Idea',
				points: [
					'4 teams, 32 pieces. Nobody owns one — you move anyone’s pieces.',
					'2 secret cards: a **friend** (you want them to win) and a **foe** (you want them to lose).',
				],
			},
			{
				heading: 'Your Turn',
				points: [
					'Exactly **one** piece action: move a piece, deploy one, or turn a sniper.',
					'Also free, any number of times: claim a team, reveal a card, accuse a player.',
					'Press **NEXT TURN** when done.',
				],
			},
			{
				heading: 'Making a Move',
				points: [
					'Select it, move it, point it, confirm — in that order.',
					'Deploying a piece from its HQ spends your one action too.',
					'Only a team’s controller may deploy its pieces from HQ.',
				],
			},
			{
				heading: 'The Pieces',
				points: [
					'**Agent** — 2 cells dead ahead. Kills what’s there.',
					'**CEO** — any distance, 6 directions. Never kills. Buffs neighbours.',
					'**Spy** — 2 single steps, any directions. Kills only on the last step, from behind.',
					'**Sniper** — never moves again. Turning it aims a line of fire.',
				],
			},
			{
				heading: 'CEO Buffs',
				intro: 'Standing next to your own CEO:',
				points: [
					'**Agent** moves 1 or 2 and kills at 1.',
					'**Spy** gets a third step.',
					'**Sniper**’s line passes straight through pieces.',
				],
			},
			{
				heading: 'Taking Control',
				points: [
					'Claim a team, then deploy its CEO — control becomes real.',
					'Or reveal a card naming that team — instant control, no CEO needed.',
					'A team whose CEO is already out can’t be claimed, only revealed.',
				],
			},
			{
				heading: 'Cards on the Table',
				points: [
					'**Reveal**: turn a card face up, −50 points, get that team at once.',
					'**Accuse**, guess right: they pay 50 points and you may accuse again.',
					'**Accuse**, guess wrong: you lose that guess for the rest of the game.',
				],
			},
			{
				heading: 'How It Ends',
				points: [
					'The game ends the instant the **third CEO** dies.',
					'Score: 100, **−50** per your own revealed card, **+**friend’s points, **−**foe’s points.',
					'Highest score wins.',
				],
			},
		],
	},
	{
		slug: 'big-idea',
		group: 'The Basics',
		title: 'The Big Idea',
		teaser: 'Four teams. Nobody owns one. That is the whole game.',
		image: {
			file: 'big-idea.png',
			alt: 'The board and all four team stores, empty and ready to play',
			caption: 'Every game starts like this — nobody playing for a team yet',
		},
		body: [
			{
				p: 'Four teams are fighting it out on the board: Black, Red, White, and Yellow. But here is the twist — nobody owns a team. Not even you.',
			},
			{
				p: 'On your turn, you can move any piece from any team. Yours, your friend’s, anyone’s. Everybody moves everybody’s pieces.',
			},
			{
				p: 'So what do you actually own? Two secret cards. One team is your **friend** — you want them to win. One team is your **foe** — you want them to lose. Nobody else knows which two you are holding.',
			},
			{
				p: 'That is the whole game. Everyone is pushing everyone’s pieces around the board, and the real game is working out who wants what — before they work out you.',
			},
			{ note: 'You could be moving your own foe’s pieces right now, and nobody at the table would know why.' },
		],
	},
	{
		slug: 'secret-cards',
		group: 'The Basics',
		title: 'Your Secret Cards',
		teaser: 'One friend, one foe. Never the same team. Never shown to anyone.',
		image: {
			file: 'secret-cards.png',
			alt: 'A Friend card naming Black and a Foe card naming Red, laid out side by side',
			caption: 'Yours to look at once, then keep face down for the rest of the evening',
		},
		body: [
			{
				p: 'At the start of the game, you are dealt two cards. One says **FRIEND**. One says **FOE**. Each one names a team.',
			},
			{
				p: 'Your friend’s points become your points. Your foe’s points come off your score. That is the entire reason to care who wins.',
			},
			{
				p: 'Keep both cards secret. Look at them once, then put them face down. Nobody else gets to see them — unless you choose to show one yourself, or somebody guesses right (more on that later).',
			},
			{
				list: [
					'Two players can share the same friend.',
					'Your friend can be someone else’s foe.',
					'A team can be nobody’s friend at all — and nobody’s foe either.',
				],
			},
			{
				p: 'Because nobody can see anyone’s cards, every move on the board is a clue. Is that player helping Black because Black is their friend? Or because they want you to think so? You will not know for certain until the cards come out.',
			},
		],
	},
	{
		slug: 'the-pieces',
		group: 'The Basics',
		title: 'What’s on the Table',
		teaser: 'A hex board, four team stores, and 32 pieces waiting to come out.',
		image: {
			file: 'the-pieces.png',
			alt: 'The full board with all four HQs, each holding a full team of pieces',
			caption: 'Black, Red, White, Yellow — the same eight pieces each, every game',
		},
		body: [
			{ p: 'The board is one big hexagon, made up of 37 smaller ones you can actually stand on.' },
			{
				p: 'Each of the four teams keeps its pieces in its own store beside the board, called an **HQ**. Every team starts with the same eight pieces:',
			},
			{
				list: [
					'**5 Agents** — the foot soldiers, worth 5 points each',
					'**1 CEO** — worth 20 points, the most valuable piece on the team',
					'**1 Spy** — worth 10 points, sneaky and hard to pin down',
					'**1 Sniper** — worth 10 points, never moves but can strike from a distance',
				],
			},
			{ p: 'Every piece starts inside its HQ. Nothing is on the board until somebody brings it out.' },
			{
				p: 'Every piece out on the board also **faces** a direction. That is not just for looks — which way a piece is looking decides where it can go, what it can hit, and what a sniper can see through it.',
			},
		],
	},
	{
		slug: 'getting-ready',
		group: 'The Basics',
		title: 'Getting Ready to Play',
		teaser: 'Two to six players. A name each. A secret pair of cards. Then you begin.',
		image: {
			file: 'getting-ready.png',
			alt: 'The name-entry screen with two players typed in and a button to deal alignments',
			caption: 'Names in, then the cards go round the table',
		},
		body: [
			{
				p: 'Gather 2 to 6 players and type in your names. The order you type them in is the order you will take turns.',
			},
			{
				p: 'Everybody gets one **friend** card and one **foe** card, dealt in secret. Look at them, remember them, then keep them face down — you will need to check back on them all game.',
			},
			{ p: 'All 32 pieces start in their HQs. The board itself is completely empty.' },
			{ p: 'Whoever’s name was typed first goes first. Then play moves around the table, one player at a time.' },
			{
				note: 'Playing on one screen? The cards get passed round, one player at a time, so nobody else peeks. Playing online? Each player only ever sees their own two cards — the server keeps everyone else’s hidden automatically.',
			},
		],
	},
	{
		slug: 'your-turn',
		group: 'Playing a Turn',
		title: 'Taking Your Turn',
		teaser: 'One piece action. Then as many free moves as you like. Then pass it on.',
		image: {
			file: 'your-turn.png',
			alt: 'The turn strip and action bar, with a team just claimed and ready to deploy',
			caption: 'Everything you can do on your turn lives in this one bar',
		},
		body: [
			{
				p: 'Every turn, you do exactly **one piece action** — bring a piece onto the board, move one, or turn a sniper. That part is compulsory. You cannot skip it.',
			},
			{ p: 'Alongside that one action, you can also do any of these, as many times as you like, for free:' },
			{
				list: [
					'**Claim a team**, or change your mind before you have moved its CEO',
					'**Reveal** one of your own cards (twice a game at most — once per card)',
					'**Accuse** another player, again and again, for as long as you keep guessing right',
				],
			},
			{ p: 'When you are done, press **NEXT TURN**. Play passes to the next player.' },
			{
				note: 'You cannot simply pass. If every piece you would like to move is stuck, you have to find one that is not — the button will not light up until something has actually happened.',
			},
			{
				p: 'One button on the screen is never yours: **SNIPE!** belongs to everyone *except* the player whose turn it is. It is how the rest of the table answers the move you just made.',
			},
		],
	},
	{
		slug: 'making-a-move',
		group: 'Playing a Turn',
		title: 'Making a Move',
		teaser: 'Pick it up. Put it down. Point it somewhere. Confirm — from the board or straight out of HQ.',
		imagesAtEnd: true,
		images: [
			{
				file: 'move-hq-idle.png',
				label: 'Idle',
				alt: 'An agent resting in its HQ, not selected',
				caption: 'Resting in HQ',
			},
			{
				file: 'move-hq-selected.png',
				label: 'Selected',
				alt: 'The same agent selected, and the board’s nearest cells lighting up red',
				caption: 'Selected — and the board answers',
			},
			{
				file: 'move-cells-highlighted.png',
				label: 'Cells',
				alt: 'Empty cells lit red around an enemy piece that is not lit',
				caption: 'Every empty cell lights up — an occupied one never does',
			},
			{
				file: 'move-placed-default.png',
				label: 'Placed',
				alt: 'The agent freshly placed, facing its default direction',
				caption: 'Landed — facing the only way it can before you point it',
			},
			{
				file: 'move-placed-turned.png',
				label: 'Faced',
				alt: 'The same agent now facing a different direction after a point click',
				caption: 'Pointed a different way — this is what confirms it',
			},
		],
		body: [
			{
				p: 'Every piece moves in the same four beats, whether you click it or drag it, or whether it is stepping fresh out of its HQ:',
			},
			{
				list: [
					'**Select it** — its legal cells light up',
					'**Move it** — click or drop it on a lit cell',
					'**Point it** — hover to choose which way it faces',
					'**Confirm** — click to lock it in',
				],
			},
			{
				list: [
					'You must move before you can turn — a sniper is the one exception, since turning *is* its whole move.',
					'Selecting costs nothing. Only confirming a real change spends your turn.',
					'Bringing a fresh piece out of its HQ works the same way, and costs your whole turn too — it just needs a landing cell that is **empty** and **safe from enemy snipers**.',
				],
			},
			{
				note: 'Only the player who controls a team may bring its pieces out — see Taking Control of a Team.',
			},
			{
				note: 'A spy is the one piece that cannot change its mind once it starts moving — more on that on its own page.',
			},
		],
	},
	{
		slug: 'the-agent',
		group: 'The Pieces',
		title: 'The Agent',
		teaser: 'Five per team. Moves two cells dead ahead. Kills what it lands on.',
		images: [
			{
				file: 'agent-move.png',
				label: 'Move',
				alt: 'An agent selected, with the one cell two ahead of it lit up red',
				caption: 'Its only legal cell — two ahead, dead straight',
			},
			{
				file: 'agent-kill.png',
				label: 'Kill',
				alt: 'An agent selected, its highlighted cell now standing on an enemy piece',
				caption: 'That same cell, with an enemy standing on it — landing there is the kill',
			},
		],
		body: [
			{ p: 'The Agent moves exactly **two cells straight ahead**, in whichever direction it is facing.' },
			{
				list: [
					'It is blocked if **anyone** — friend or enemy — is standing one cell ahead.',
					'It is blocked if a **friendly** piece is two cells ahead.',
					'It **kills** by landing on an **enemy** two cells ahead.',
				],
			},
			{
				p: 'After it moves, it can turn — but only a little: straight ahead, or one step to either side. Never backwards.',
			},
			{
				p: 'Walk it off the edge of the board, and it does not fall off — it comes straight back onto any free cell you like, exactly like a fresh deployment.',
			},
			{
				note: 'Stand an Agent next to its own CEO and it gets stronger — it can move one cell *or* two, and it can kill at just one cell ahead. See CEO Buffs.',
				buff: true,
			},
		],
	},
	{
		slug: 'the-ceo',
		group: 'The Pieces',
		title: 'The CEO',
		teaser: 'The most valuable piece on the team — and the one that can never kill.',
		images: [
			{
				file: 'ceo-move.png',
				label: 'Move',
				alt: 'A CEO selected, with long lines of cells lit up red in every direction',
				caption: 'Any distance, any of six directions — as far as the board allows',
			},
			{
				file: 'ceo-blocked.png',
				label: 'Blocked',
				alt: 'A CEO selected, its lit cells stopping short of an enemy piece further down the line',
				caption: 'It stops right before the enemy — a CEO can never land on, or kill, anyone',
			},
		],
		body: [
			{
				p: 'The CEO moves **any distance, in a straight line, in any of the six directions** — as far as the board or the first piece in its way allows.',
			},
			{
				p: 'It stops right before whoever is blocking it, friend or enemy. That is the trade-off for going so far: the CEO **can never kill**.',
			},
			{
				p: 'It does not turn on its own — it always faces whichever way it just moved. Only when you first bring it onto the board can you point it wherever you like.',
			},
			{ p: 'Why the CEO matters so much:' },
			{
				list: [
					'It **buffs** every one of its own team’s pieces standing right next to it.',
					'Bringing it onto the board is what turns a claim on a team into real control.',
					'If it dies, **every piece of its team still waiting in the HQ dies with it.**',
					'The game ends the instant the **third** CEO falls.',
				],
			},
		],
	},
	{
		slug: 'the-spy',
		group: 'The Pieces',
		title: 'The Spy',
		teaser: 'Two quick steps, zig-zagging wherever it likes — and a kill from behind.',
		images: [
			{
				file: 'spy-move.png',
				label: 'Move',
				alt: 'A spy selected, with its neighbouring cells lit up red for its next single step',
				caption: 'One step at a time, in any direction — that is the whole zig-zag',
			},
			{
				file: 'spy-kill.png',
				label: 'Kill',
				alt: 'A spy selected, one of its highlighted cells standing directly behind an enemy piece',
				caption: 'Lit up behind the enemy — the one angle a Spy is allowed to strike from',
			},
		],
		body: [
			{
				p: 'The Spy takes **two single steps**, one cell at a time, choosing a new direction for each step. That means it can zig-zag anywhere within reach.',
			},
			{ p: 'Its first step has to land on an **empty** cell — a Spy cannot kill on the way, only right at the end.' },
			{
				p: 'On its last step, it can kill — but only by walking up on an enemy **from behind**: straight behind them, or from one of the two rear corners. Walk up to their face or their side, and it is simply not an option.',
			},
			{
				p: 'Once a Spy has taken its first step, there is no putting it back — you must finish both steps before your turn can end.',
			},
			{ note: 'Standing next to its own CEO, a Spy gets a third step instead of two.', buff: true },
		],
	},
	{
		slug: 'the-sniper',
		group: 'The Pieces',
		title: 'The Sniper',
		teaser: 'It never moves again once it’s placed. It doesn’t need to.',
		imagesAtEnd: true,
		images: [
			{
				file: 'sniper-place.png',
				label: 'Place',
				alt: 'The whole board, every legal deployment cell for a fresh sniper lit up red',
				caption: 'Every cell it could be placed on — each with a shot open from it',
			},
			{
				file: 'sniper-line.png',
				label: 'Line',
				alt: 'A sniper in one corner of the board; a different team’s piece selected, its own legal cells lit everywhere except the diagonal the sniper is watching',
				caption: 'A different team’s own legal cells go dark in a line — that line is the shot',
			},
			{
				file: 'sniper-blocked.png',
				label: 'Blocked',
				alt: 'The same board, but a piece part-way down the line has taken the cells behind it back off the dark stripe',
				caption: 'The first piece it hits ends the line — everything behind it lights back up',
			},
			{
				file: 'sniper-kill.png',
				label: 'Kill',
				alt: 'A lit sniper, having marked an enemy piece that crossed its line of fire',
				caption: 'Lit and marked — SNIPE! is the only way it ever kills',
			},
		],
		body: [
			{
				p: 'Once a Sniper is on the board, it never moves again. From then on, its whole "turn" is simply choosing a new direction to face.',
			},
			{
				p: 'Facing a direction gives it a **line of fire**: every cell in a straight line that way, stopping at — and including — the first piece it hits.',
			},
			{
				p: 'It can only be placed somewhere with **at least one** direction that has no enemy in the way — there always has to be a shot available from wherever it stands.',
			},
			{
				p: 'A Sniper does not kill by walking into anyone. It kills by **watching** — see Snipers in Action for how that actually plays out.',
			},
			{
				note: 'Stand a Sniper next to its own CEO, and its line of fire passes straight through pieces, all the way to the edge of the board.',
				buff: true,
			},
		],
	},
	{
		slug: 'quick-reference',
		group: 'The Pieces',
		title: 'Quick Reference',
		teaser: 'All four pieces, side by side, for whenever you forget.',
		table: {
			headers: ['', 'Move', 'Kills', 'Buffed'],
			rows: [
				['Agent', 'exactly 2 ahead', 'enemy 2 ahead', '1 *or* 2 ahead; kills at 1'],
				['CEO', 'any distance, 6 directions', 'never', 'buffs others, gains nothing itself'],
				['Spy', '1 cell, twice, any directions', 'enemy on the last step, from behind', '1 cell, three times'],
				['Sniper', 'never — it only turns', 'via SNIPE!', 'sees straight through pieces'],
			],
		},
		body: [{ p: 'Every deployment cell, for every piece, also has to sit outside every enemy sniper’s line of fire.' }],
	},
	{
		slug: 'killing',
		group: 'Combat & Control',
		title: 'Killing',
		teaser: 'Land on them, and they’re gone — to the cemetery.',
		image: {
			file: 'killing-hq.png',
			alt: 'The HQ card of the team that just made a kill',
			caption: 'The credit for a kill goes to whoever’s HQ this is',
		},
		body: [
			{
				p: 'If a piece ends its move standing where somebody else already is, that piece **dies**. It is that simple — the game never lets you land somewhere that would kill a friend, so every landing you are ever offered is a kill of an enemy.',
			},
			{
				p: 'A dead piece goes to the cemetery of whichever team killed it — which is also what earns that team the points for the kill.',
			},
			{
				p: 'Killing a **CEO** is bigger than an ordinary kill: every piece of that team still waiting in its HQ dies too. Anything of theirs already out on the board is untouched, and anybody can still move it.',
			},
			{
				note: 'A sniper’s kill counts exactly the same way — credited to the sniper’s own team, just like walking into someone.',
			},
		],
	},
	{
		slug: 'ceo-buffs',
		group: 'Combat & Control',
		title: 'CEO Buffs',
		teaser: 'Stand next to your own CEO, and you get stronger.',
		imagesAtEnd: true,
		images: [
			{
				file: 'buff-agent.png',
				label: 'Agent',
				alt: 'A glowing, buffed agent with both one and two cells ahead lit up red',
				caption: 'Buffed, both reachable cells light up — one or two ahead',
			},
			{
				file: 'buff-spy.png',
				label: 'Spy',
				alt: 'A glowing, buffed spy with an enemy three cells away lit up as a legal kill',
				caption: 'A third step reaches this kill — two never would have',
			},
			{
				file: 'buff-sniper.png',
				label: 'Sniper',
				alt: 'The board with a buffed sniper’s dark line running straight through a blocking piece',
				caption: 'Buffed, the line runs straight through the blocker instead of stopping at it',
			},
		],
		body: [
			{
				p: 'Any piece standing right beside its **own team’s** CEO gets a boost, recalculated fresh at the start of every turn:',
			},
			{
				list: [
					'**Agent** — moves 1 *or* 2 cells ahead, and can kill at just 1 cell',
					'**Spy** — gets a third step instead of two',
					'**Sniper** — its line of fire now passes straight through pieces, all the way to the edge',
					'**CEO** — nothing. A CEO does not buff itself.',
				],
			},
			{
				p: 'Timing matters here: buffs are only worked out once, right when a new turn starts. Walk a piece next to a CEO mid-turn, and it is not buffed until the *next* turn begins.',
			},
		],
	},
	{
		slug: 'snipers-in-action',
		group: 'Combat & Control',
		title: 'Snipers in Action',
		teaser: 'The one move that isn’t yours — it belongs to the rest of the table.',
		images: [
			{
				file: 'snipe-before.png',
				label: 'Before',
				alt: 'A piece sitting clear of a sniper’s line of fire',
				caption: 'Clear of the line — for now',
			},
			{
				file: 'snipe-crossed.png',
				label: 'Crossed',
				alt: 'The same piece, having just moved through the sniper’s line of fire',
				caption: 'Moved through it — marked, though nothing shows it yet',
			},
			{
				file: 'snipe-armed.png',
				label: 'Snipe!',
				alt: 'The sniper lit up, having marked the piece that crossed its line',
				caption: 'SNIPE! pressed — the mark lights the sniper up',
			},
			{
				file: 'snipe-after.png',
				label: 'After',
				alt: 'The board after the sniper fired, the marked piece gone',
				caption: 'Fired — the piece is gone and the turn has passed on',
			},
		],
		body: [
			{
				p: 'Whenever a piece moves **into, out of, or through** an enemy sniper’s line of fire, that sniper marks it. The whole path is checked, not just where it lands — cross the line and keep going, and you are still marked.',
			},
			{
				p: 'Here is the twist: the shot does not belong to whoever’s turn it is. **SNIPE! belongs to everyone else.** It is how the rest of the table answers the move that was just made.',
			},
			{
				p: 'Press SNIPE!, and every sniper with a marked target lights up. Click a lit sniper, and three things happen at once:',
			},
			{
				list: [
					'**Every piece it marked dies.**',
					'**The rest of the board rolls back** to how it stood at the start of the turn — the move is undone, along with everything it did.',
					'**The turn ends** and passes on as normal.',
				],
			},
			{
				p: 'You only get one window to fire: the same turn the movement happened in. Once NEXT TURN is pressed, the mark is gone for good.',
			},
			{
				note: 'Pressing SNIPE! freezes the board — nothing else can be clicked until the shot is taken. There is no arming it and changing your mind.',
			},
		],
	},
	{
		slug: 'taking-control',
		group: 'Combat & Control',
		title: 'Taking Control of a Team',
		teaser: 'Only the person who controls a team may bring its pieces onto the board.',
		imagesAtEnd: true,
		images: [
			{
				file: 'control-claim-click.png',
				label: 'Claim',
				alt: 'An unclaimed team’s HQ, with its CLAIM button',
				caption: 'Press CLAIM',
			},
			{
				file: 'control-place-ceo.png',
				label: 'Place CEO',
				alt: 'That team’s CEO landing on the board',
				caption: 'Bring its CEO onto the board',
			},
			{
				file: 'control-alice.png',
				label: 'Control: Alice',
				alt: 'The HQ card now reading CONTROL: ALICE',
				caption: 'The team is really hers',
			},
			{
				file: 'control-reveal-click.png',
				label: 'Reveal',
				alt: 'A Friend card turned face up, naming Yellow',
				caption: 'Or reveal a card naming the team',
			},
			{
				file: 'control-bob.png',
				label: 'Control: Bob',
				alt: 'That team’s HQ card now reading CONTROL: BOB',
				caption: 'His at once — no CEO required',
			},
		],
		body: [
			{ p: 'You can hold control of **one team at a time**. Taking a second team lets go of the first.' },
			{ p: 'There are two ways to take control:' },
			{
				list: [
					'**Claim it, then deploy its CEO.** Press that team’s CLAIM button, then bring its CEO onto the board. The moment it lands, the team is really yours.',
					'**Reveal a card naming it.** Turning one of your own cards face up hands you that team immediately — CEO on the board or not.',
				],
			},
			{
				p: 'Only the controller may bring new pieces out of that team’s HQ. Anything of theirs already on the board is public property — anyone whose turn it is can move it.',
			},
			{
				note: 'A team whose CEO is already on the board cannot be claimed this way any more — the only way to take it from here is to reveal a card that names it.',
			},
		],
	},
	{
		slug: 'revealing',
		group: 'Cards on the Table',
		title: 'Revealing',
		teaser: 'Turn a card face up. It costs you 50 points — and hands you a team.',
		image: {
			file: 'revealing.png',
			alt: 'A Friend card turned face up, naming Black, beside a Foe card still blank',
			caption: 'One card up, one still secret',
		},
		body: [
			{
				p: 'On your turn, press REVEAL and turn your Friend or Foe card face up. Once it is up, it stays up for the rest of the game.',
			},
			{ p: 'It costs you **50 points** off your final score. Turn both cards over, and that is 100 points gone.' },
			{ p: 'In exchange, you get that team **immediately** — no CEO required.' },
			{
				p: 'Revealing does not use up your turn. You can still make your piece move, and you can even reveal both cards in the same turn if you want to.',
			},
		],
	},
	{
		slug: 'accusing',
		group: 'Cards on the Table',
		title: 'Accusing',
		teaser: 'Guess someone’s secret. Get it right, and they pay for it instead of you.',
		image: {
			file: 'accusing.png',
			alt: 'A correct accusation verdict, naming the accused player’s foe team',
			caption: 'A guess that landed — and someone else’s 50 points',
		},
		body: [
			{ p: 'On your turn, press ACCUSE, pick another player, choose Friend or Foe, and name a team.' },
			{
				p: '**Guess right**, and their card is turned face up — they pay the same 50 points a voluntary reveal costs. Best of all, it costs *you* nothing, and you can accuse again.',
			},
			{
				p: '**Guess wrong**, and you can never accuse that slot again for the rest of the game. Get somebody’s friend wrong, and you have lost the right to guess anyone’s friend, ever again — your foe accusations are untouched.',
			},
			{ p: 'Accusing does not spend your turn either. Keep guessing right, and you can keep going.' },
			{
				note: 'An accusation that lands correctly does not hand you control of that team — only a voluntary reveal does that.',
			},
		],
	},
	{
		slug: 'how-it-ends',
		group: 'Winning',
		title: 'How It Ends',
		teaser: 'The third CEO falls, and every card comes out.',
		image: {
			file: 'how-it-ends.png',
			alt: 'The final score sheet, with every player’s total and every team’s tally shown',
			caption: 'Every card face up, every point on the table',
		},
		body: [
			{ p: 'The game ends the instant the **third CEO** dies. One team is left standing with its CEO still alive.' },
			{
				p: 'Every alignment card is turned face up — friend and foe alike — because working out who won needs to see all of them.',
			},
			{ p: 'Here is how your score is worked out:' },
			{
				list: [
					'Start at **100**.',
					'**Lose 50** for each of your own cards that ended up face up — whether you revealed it yourself or someone guessed it right.',
					'**Add** your friend team’s points.',
					'**Subtract** your foe team’s points.',
				],
			},
			{
				p: 'A team’s own points come from the value of everyone it killed, plus the value of its own pieces still standing on the board. Anything still waiting in the HQ counts for nothing — sitting it out is not the same as surviving.',
			},
			{ p: '**Whoever has the highest score wins.**' },
			{
				note: 'Build your friend up, tear your foe down, and try to stay unread — the 50 points you pay to seize a team is exactly the price of everyone at the table knowing what you are after.',
			},
		],
	},
	{
		slug: 'playing-online',
		group: 'Winning',
		title: 'Playing Online',
		teaser: 'Same rules. Real people, wherever they are.',
		image: {
			file: 'playing-online.png',
			alt: 'The online lobby’s "Join a game" screen, with a public room listed',
			caption: 'A room, a code, and a seat waiting for you',
		},
		body: [
			{
				p: 'Everything on these pages works exactly the same whether you are playing online or on one shared screen. What playing online adds is simple:',
			},
			{
				list: [
					'**Rooms** hold up to 6 seats, opened with a short code you can share.',
					'**Your cards are yours alone.** The people you are playing with never even receive them — the server only ever sends you your own two.',
					'**Only whoever’s turn it is may act** — except for SNIPE!, which belongs to everyone else, exactly as it does on one screen.',
					'**A closed laptop cannot hold up the game.** If somebody vanishes for a minute, anyone can press NEXT TURN for them.',
				],
			},
			{ p: 'Open "Start a game" to host your own table, or "Join a game" to find one already waiting for you.' },
		],
	},
];

export function findRulePage(slug) {
	return RULES_PAGES.find(page => page.slug === slug) || null;
}

export default RULES_PAGES;
