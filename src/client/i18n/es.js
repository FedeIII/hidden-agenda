// El juego en castellano.
//
// Mismas claves que `en.js`, una por una — `src/tests/unit/i18n.test.js` lo comprueba, así que una
// clave que falte aquí es un test en rojo y no una frase en inglés que nadie ve venir.
//
// El vocabulario del juego, fijado una vez y usado siempre igual (regla 1 del glosario: una palabra,
// un significado). El libro de reglas y el curso lo siguen al pie de la letra:
//
//   team → equipo · cell → casilla · board → tablero · HQ → cuartel · piece → pieza
//   agent → agente · CEO → CEO · spy → espía · sniper → francotirador
//   friend → amigo · foe → enemigo · to claim → reclamar · to reveal → revelar
//   to accuse → acusar · to deploy → desplegar · buff → mejora · line of fire → línea de tiro
//   room → sala · seat → asiento · host → anfitrión · hot-seat → una sola pantalla
//
// «CEO» se queda en inglés a propósito: es el nombre de la pieza, está impreso en su ficha y en las
// fotografías del libro de reglas, y traducirlo dejaría el texto diciendo una cosa y el tablero otra.

export default {
	// El nombre del juego no se traduce.
	app: {
		title: 'Hidden Agenda',
		loading: 'Cargando la partida…',
	},

	common: {
		mainMenu: 'Menú principal',
		index: 'Índice',
		back: '‹ Atrás',
		cancel: 'CANCELAR',
		backToBoard: 'VOLVER AL TABLERO',
		you: ' (tú)',
	},

	team: {
		0: 'NEGRO',
		1: 'ROJO',
		2: 'BLANCO',
		3: 'AMARILLO',
	},

	alignment: {
		friend: {
			card: 'Amigo',
			word: 'amigo',
			note: 'sus puntos son tuyos',
		},
		foe: {
			card: 'Enemigo',
			word: 'enemigo',
			note: 'sus puntos se restan de los tuyos',
		},
	},

	language: {
		label: 'Idioma',
		short: { en: 'EN', es: 'ES' },
		name: { en: 'English', es: 'Español' },
	},

	skin: {
		label: 'Estilo',
		dossier: 'expediente',
		blueprint: 'plano',
		vault: 'caja fuerte',
	},

	connection: {
		connecting: 'Conectando…',
		reconnecting: 'Conexión perdida — reconectando…',
		displaced: 'Este asiento está abierto en otra ventana: juega allí, o recarga aquí para recuperarlo.',
	},

	lobby: {
		connecting: 'Conectando…',
		reconnecting: 'Reconectando…',

		yourName: 'Tu nombre',
		namePlaceholder: 'NOMBRE',
		verifyHuman: 'Verifica que eres humano',
		turnstileHint: 'Completa la comprobación para continuar.',
		lastGame: 'Última partida: {sign}{delta} — estás en {after}.',

		caseFile: 'Expediente',
		howToPlay: 'Cómo se juega',
		startAGame: 'CREAR PARTIDA',
		joinAGame: 'ENTRAR EN UNA PARTIDA',
		hotSeatInstead: 'JUGAR EN UNA SOLA PANTALLA',
		noServer: 'Ningún servidor respondió. El modo de una pantalla se juega en esta pestaña y no necesita ninguno.',

		startTitle: 'Crear partida',
		joinTitle: 'Entrar en una partida',

		automatch: 'Partida rápida',
		findMeAGame: 'BÚSCAME UNA PARTIDA',
		searching: 'Buscando — {waiting} en espera',
		searchingRating: ', estás en {rating}',
		searchingAnyRating: ', cualquier nivel',
		needName: 'Di primero quién eres.',

		newRoom: 'Sala nueva',
		roomNamePlaceholder: 'NOMBRE DE LA SALA',
		reroll: '↻',
		listed: 'Listada',
		public: 'Pública',
		private: 'Privada',
		createRoom: 'CREAR SALA',
		privateHint: 'Una sala privada solo se encuentra por su código.',

		findARoom: 'Buscar una sala',
		searchPlaceholder: 'BUSCAR POR NOMBRE',
		roomsOffline: 'La lista de salas necesita un servidor al que preguntar.',
		noRoomsNamed: 'Ninguna sala pública con ese nombre.',
		noRoomsYet: 'Todavía no hay salas públicas. Abre una.',
		showingSome: 'Mostrando {shown} de {total}. Busca para acotar.',

		orJoinByCode: 'O entra con un código',
		codePlaceholder: 'CÓDIGO',
		join: 'ENTRAR',

		inAGame: 'Estás en una partida',
		roomState: {
			lobby: 'abierta',
			started: 'empezada',
			yours: 'tuya',
			resume: 'volver',
		},

		room: 'Sala',
		privateRoom: 'Sala privada',
		roomCode: 'Código de la sala',
		players: 'Jugadores ({count}/{max})',
		host: 'anfitrión',
		offline: ' desconectado',
		start: 'EMPEZAR',
		waitingForHost: 'Esperando a que el anfitrión empiece…',
		leaveRoom: 'SALIR DE LA SALA',
		needMorePlayers: 'Hacen falta al menos {min} jugadores.',

		reason: {
			no_such_room: 'No hay ninguna sala con ese código.',
			room_full: 'Esa sala está llena.',
			name_taken: 'Alguien de esa sala ya tiene ese nombre.',
			room_already_started: 'Esa partida ya ha empezado.',
			not_enough_players: 'Espera a que haya al menos {min} jugadores.',
			seat_lost: 'Tu asiento ya no está. Vuelve a entrar con un nombre.',
			server_full: 'El servidor está en su límite de salas. Inténtalo dentro de un momento.',
			slow_down: 'Demasiados intentos. Espera un momento.',
			not_host: 'Solo el jugador que creó la sala puede empezarla.',
			skin_locked: 'El estilo no se puede cambiar una vez empezada la partida.',
			bad_skin: 'No existe ese estilo.',
			bad_room_name: 'Un nombre de sala son letras, dígitos, espacios y guiones.',
			already_seated: 'Ya estás en una mesa.',
			bad_turnstile: 'La comprobación antibots falló. Inténtalo otra vez.',
			left_alone: 'Todos los demás se fueron, así que la partida terminó.',
			quit_timeout: 'Saliste de una partida en curso. Puedes jugar otra vez en {wait}.',
			quit_timeout_vague: 'Saliste de una partida en curso. Espera un momento antes de empezar otra.',
		},
		waitSeconds: '{seconds}s',
		waitMinutes: '{minutes} min',
	},

	start: {
		numberOfPlayers: '1. NÚMERO DE JUGADORES',
		players: '2. JUGADORES',
		player: 'JUGADOR {n}',
		getAlignments: 'REPARTIR CARTAS',
		playOnlineInstead: 'JUGAR EN LÍNEA',
	},

	alignmentPhase: {
		onlyForEyes: 'Esto es solo para los ojos de {name}',
		expose: 'Descubre tus alineamientos',
		allReady: '¡Ya estáis listos para empezar!',
		nextPlayer: 'SIGUIENTE JUGADOR',
		start: 'EMPEZAR',
		waitingForTable: 'Esperando a la mesa…',
		theseAreYours: '{name}, estas son tuyas',
		nobodyElseSees: 'Nadie más puede verlas',
		ready: 'LISTO',
		waiting: 'ESPERANDO…',
		readyCount: '{ready}/{total} listos',
	},

	play: {
		// DIBUJADO POR es la casilla del cajetín de un plano, y no choca con FIRMADO POR, que es de
		// quien controla un equipo. El maletín se abre delante de quien tiene el turno.
		onTheDeskOf: 'en el escritorio de',
		drawnBy: 'dibujado por',
		caseOpenFor: 'maletín abierto para',
		ceosDown: 'ceos caídos',
		nextTurn: 'PASAR TURNO',

		snipe: '¡DISPARO!',
		standDown: 'ALTO EL FUEGO',
		snipeOnly: 'el disparo es de {name}',
		snipeNot: 'cualquiera menos {name}',
		fallenSniper: 'FRANCOTIRADOR ABATIDO',
		fallenSniperNote: 'pulsa su casilla para disparar',
		// DESPLEGADO, MOVIDO, ABATIDO y RECLAMADO son los verbos que ya usan el curso y la marca del
		// francotirador. Los cuatro tipos son masculinos o de género común, así que un solo
		// participio vale para todos.
		lastMovePlaced: '{piece} DESPLEGADO',
		lastMoveMoved: '{piece} MOVIDO',
		lastMoveKilled: '{piece} ABATIDO',
		lastMoveClaimed: 'EQUIPO RECLAMADO',

		pieceAgent: 'AGENTE',
		pieceCeo: 'CEO',
		pieceSpy: 'ESPÍA',
		pieceSniper: 'FRANCOTIRADOR',
		accuse: 'ACUSAR',
		reveal: 'REVELAR',
		friendFoe: 'AMIGO Y ENEMIGO',
		leave: 'SALIR',

		claim: 'RECLAMAR',
		cancelClaim: 'CANCELAR',
		teamRef: 'equipo {team}',
	},

	accuseScreen: {
		title: 'Acusar a un jugador',
		verdictTitle: 'Tu acusación',
		whom: '¿A quién acusas?',
		cost: 'un fallo te cuesta esa acusación para el resto de la partida',
		nothingPublic: 'todavía nada público',
		knownFriend: 'amigo: {team}',
		knownFoe: 'enemigo: {team}',
		whichAlignment: '¿Qué carta de {name}?',
		blockedFriend: 'ya fallaste un amigo',
		blockedFoe: 'ya fallaste un enemigo',
		blockedPublic: 'ya es pública',
		whichTeamFriend: '¿De qué equipo es el amigo de {name}?',
		whichTeamFoe: '¿De qué equipo es el enemigo de {name}?',
		correct: 'Acierto',
		wrong: 'Fallo',
		detailFriendYes: 'el amigo de {name} es {team}',
		detailFriendNo: 'el amigo de {name} no es {team}',
		detailFoeYes: 'el enemigo de {name} es {team}',
		detailFoeNo: 'el enemigo de {name} no es {team}',
		costCorrect: 'ahora es pública, y le ha costado {points} puntos a {name}',
		costWrongFriend: 'no podrás volver a acusar un amigo',
		costWrongFoe: 'no podrás volver a acusar un enemigo',
	},

	revealScreen: {
		title: 'Revelar un alineamiento',
		bothTitle: 'Las dos ya son públicas',
		note: 'cuesta {points} puntos, y te entrega ese equipo al momento',
		bothNote: 'no queda nada que entregar',
		spent: '−{points} puntos gastados en revelar',
		revealNothing: 'NO REVELAR NADA',
	},

	friendFoeScreen: {
		title: 'Tu amigo y tu enemigo',
		onlyForEyes: 'solo para los ojos de {name}',
		nobodyElseSees: 'nadie más puede verlas',
		isLooking: '{name} ESTÁ MIRANDO',
		putItAway: 'GUARDARLAS',
		on: 'en',
		withheld: 'oculto',
		revealed: 'revelado',
		accusedBy: 'acusado por {name}',
		baseNote:
			'todos parten de {base} · que un alineamiento se haga público le cuesta {cost} a su dueño · los equipos se cuentan al final',
	},

	leaveScreen: {
		title: 'Salir de la partida',
		leaveTitle: '¿Salir de la partida?',
		endTitle: '¿Terminar la partida?',
		strandsNote: 'una partida necesita {min}, así que el último jugador sale contigo',
		carriesOnNote: 'la partida sigue sin ti',
		strandsCost: 'nadie puntúa, y la sala desaparece',
		noWayBackCost: 'una sala empezada no acepta asientos nuevos, así que no hay vuelta',
		ratingCost: 'cuenta como derrota, y la siguiente partida espera un tiempo',
		endIt: 'TERMINAR',
		leave: 'SALIR',
	},

	end: {
		points: 'pts',
		killed: 'Eliminados:',
		survivors: 'Supervivientes:',
		winner: 'Ganador: ',
		leaveGame: 'SALIR DE LA PARTIDA',
	},

	rules: {
		howToPlay: 'Cómo se juega',
		intro:
			'Todos mueven las piezas de todos. Solo dos cartas, guardadas en secreto, dicen de qué lado estás de verdad. Aquí está el juego entero, en palabras llanas: elige una página, o léelo de principio a fin.',
		exerciseCount: '{count} ejercicios',
		learnByPlaying: 'Aprende jugando',
		learnTeaser: 'Casi nada que leer. Ve haciendo clic.',
		trainingStampTop: 'Entrenamiento',
		trainingStampBottom: 'de campo',
		cheatSheetTitle: 'Hoja de resumen',
		cheatSheetTeaser: 'Todas las reglas, una pantalla, sin desplazarse',
		figure: 'Fig. {n}',
		lightboxHint: 'Esc o clic fuera para cerrar',
		ceoBuff: 'Mejora del CEO',
		missingPage: 'Esa página no está aquí',
		backTo: 'Volver a {title}',
		onTo: 'Seguir con {title}',
	},

	training: {
		fieldTraining: 'Entrenamiento de campo',
		exerciseOf: 'Ejercicio {n} de {total}',
		// Las dos pestañas que dicen qué mitad de la pantalla es cada una. `liveBoard` va en el tapete
		// que tiene el juego real; la carpeta de arriba tiene el curso.
		liveBoard: 'Tablero real',
		yourCards: 'Tus cartas',
		matNote: 'Pulsa lo que está marcado',
		record: 'Historial',
		startOver: 'Empezar de nuevo',
		step: 'Paso {n} / {total}',
		passed: 'Superado',
		readTheFile: 'Leer el expediente',
		next: 'Siguiente ›',
		finish: 'Terminar ›',
		cleared: 'Completado',
		wholeGame: 'Ese es todo el juego de mesa.',
		pagesLeft: 'Quedan dos páginas por leer',
		playNow: 'Jugar ya',
		backToIndex: 'Volver al índice',
		classified: 'Clasificado',
		cardOfTwo: 'Carta {n} de 2',
		lineOfFire: 'línea de tiro',
	},
};
