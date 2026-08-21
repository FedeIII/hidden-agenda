// El libro de reglas en castellano: mismas páginas, mismos slugs, mismas fotografías.
//
// Traducido de `content.en.js`, que es la versión de referencia. Solo cambian las palabras: un
// slug está en la URL y tiene que abrir la misma página para todo el mundo, y un `imagesAtEnd` o
// una `table` son maquetación y no idioma. `src/tests/unit/i18n.test.js` comprueba las dos cosas.
//
// El vocabulario es el del glosario de `i18n/es.js` — equipo, casilla, cuartel, agente, CEO,
// espía, francotirador, amigo, enemigo, mejora, línea de tiro — y los nombres de los botones son
// los que el juego escribe de verdad en pantalla: PASAR TURNO, ¡DISPARO!, RECLAMAR, REVELAR,
// ACUSAR. Una regla que nombra un botón que no existe es peor que ninguna regla.
//
// Aviso sobre las fotografías: son capturas de la interfaz en inglés. El texto de cada `caption`
// describe lo que se ve, no lo que dice la captura.

export const GROUPS = [
	'Lo básico',
	'Jugar un turno',
	'Las piezas',
	'Combate y control',
	'Cartas sobre la mesa',
	'Ganar',
];

export const RULES_PAGES = [
	{
		slug: 'cheat-sheet',
		title: 'Hoja de resumen',
		teaser: 'Todas las reglas, una pantalla, sin desplazarse.',
		cheatSheet: [
			{
				heading: 'La idea',
				points: [
					'4 equipos, 32 piezas. Nadie es dueño de ninguna: mueves las piezas de cualquiera.',
					'2 cartas secretas: un **amigo** (quieres que gane) y un **enemigo** (quieres que pierda).',
				],
			},
			{
				heading: 'Tu turno',
				points: [
					'**Una** sola acción de pieza: mover una, desplegar una, o girar un francotirador.',
					'Además, gratis y tantas veces como quieras: reclamar un equipo, revelar una carta, acusar a un jugador.',
					'Pulsa **PASAR TURNO** cuando termines.',
				],
			},
			{
				heading: 'Hacer un movimiento',
				points: [
					'Selecciónala, muévela, apúntala, confirma — en ese orden.',
					'Desplegar una pieza desde su cuartel también te gasta la acción.',
					'Solo quien controla un equipo puede desplegar sus piezas desde el cuartel.',
				],
			},
			{
				heading: 'Las piezas',
				points: [
					'**Agente** — 2 casillas de frente. Mata lo que haya allí.',
					'**CEO** — cualquier distancia, 6 direcciones. Nunca mata. Mejora a sus vecinos.',
					'**Espía** — 2 pasos sueltos, en cualquier dirección. Solo mata en el último paso, por la espalda.',
					'**Francotirador** — no vuelve a moverse. Girarlo apunta una línea de tiro.',
				],
			},
			{
				heading: 'Mejoras del CEO',
				intro: 'Al lado de tu propio CEO:',
				points: [
					'El **agente** mueve 1 o 2 y mata a 1.',
					'El **espía** gana un tercer paso.',
					'La línea del **francotirador** atraviesa las piezas.',
				],
			},
			{
				heading: 'Tomar el control',
				points: [
					'Reclama un equipo y despliega su CEO: el control se hace real.',
					'O revela una carta que nombre ese equipo: control al momento, sin CEO.',
					'Un equipo con el CEO ya en el tablero no se puede reclamar, solo revelar.',
				],
			},
			{
				heading: 'Cartas sobre la mesa',
				points: [
					'**Revelar**: pones una carta boca arriba, −50 puntos, y el equipo es tuyo al momento.',
					'**Acusar** y acertar: el otro paga 50 puntos y tú puedes volver a acusar.',
					'**Acusar** y fallar: pierdes esa acusación para el resto de la partida.',
				],
			},
			{
				heading: 'Cómo termina',
				points: [
					'La partida acaba en el instante en que muere el **tercer CEO**.',
					'Puntuación: 100, **−50** por cada carta tuya que esté descubierta, **+** los puntos de tu amigo, **−** los de tu enemigo.',
					'Gana la puntuación más alta.',
				],
			},
		],
	},
	{
		slug: 'big-idea',
		group: 'Lo básico',
		title: 'La idea principal',
		teaser: 'Cuatro equipos. Nadie es dueño de ninguno. Ahí está todo el juego.',
		image: {
			file: 'big-idea.png',
			alt: 'El tablero y los cuatro almacenes de equipo, vacíos y listos para jugar',
			caption: 'Todas las partidas empiezan así: nadie juega todavía para ningún equipo',
		},
		body: [
			{
				p: 'Cuatro equipos se pelean en el tablero: negro, rojo, blanco y amarillo. Pero aquí está la vuelta de tuerca: nadie es dueño de un equipo. Tú tampoco.',
			},
			{
				p: 'En tu turno puedes mover cualquier pieza de cualquier equipo. Las tuyas, las de tu amigo, las de quien sea. Todos mueven las piezas de todos.',
			},
			{
				p: 'Entonces, ¿qué es tuyo de verdad? Dos cartas secretas. Un equipo es tu **amigo**: quieres que gane. Otro es tu **enemigo**: quieres que pierda. Nadie más sabe qué dos tienes en la mano.',
			},
			{
				p: 'Ahí está todo el juego. Todo el mundo empuja las piezas de todo el mundo por el tablero, y la partida de verdad es averiguar quién quiere qué — antes de que averigüen lo tuyo.',
			},
			{ note: 'Puedes estar moviendo ahora mismo las piezas de tu propio enemigo, y nadie en la mesa sabría por qué.' },
		],
	},
	{
		slug: 'secret-cards',
		group: 'Lo básico',
		title: 'Tus cartas secretas',
		teaser: 'Un amigo, un enemigo. Nunca el mismo equipo. Nunca a la vista de nadie.',
		image: {
			file: 'secret-cards.png',
			alt: 'Una carta de amigo que nombra al negro y una de enemigo que nombra al rojo, una al lado de la otra',
			caption: 'Para mirarlas una vez y dejarlas boca abajo el resto de la noche',
		},
		body: [
			{
				p: 'Al empezar la partida recibes dos cartas. Una dice **AMIGO**. La otra dice **ENEMIGO**. Cada una nombra un equipo.',
			},
			{
				p: 'Los puntos de tu amigo son tus puntos. Los de tu enemigo se restan de tu puntuación. Esa es toda la razón para que te importe quién gana.',
			},
			{
				p: 'Guarda las dos cartas en secreto. Míralas una vez y déjalas boca abajo. Nadie más las ve, salvo que decidas enseñar una tú, o que alguien acierte al adivinarla (más adelante hay más sobre eso).',
			},
			{
				list: [
					'Dos jugadores pueden compartir el mismo amigo.',
					'Tu amigo puede ser el enemigo de otro.',
					'Un equipo puede no ser el amigo de nadie — ni el enemigo de nadie.',
				],
			},
			{
				p: 'Como nadie puede ver las cartas de nadie, cada movimiento del tablero es una pista. ¿Ese jugador ayuda al negro porque el negro es su amigo? ¿O porque quiere que tú lo creas? No lo sabrás con seguridad hasta que salgan las cartas.',
			},
		],
	},
	{
		slug: 'the-pieces',
		group: 'Lo básico',
		title: 'Lo que hay en la mesa',
		teaser: 'Un tablero hexagonal, cuatro almacenes de equipo y 32 piezas esperando salir.',
		image: {
			file: 'the-pieces.png',
			alt: 'El tablero completo con los cuatro cuarteles, cada uno con su equipo entero de piezas',
			caption: 'Negro, rojo, blanco, amarillo — las mismas ocho piezas cada uno, en cada partida',
		},
		body: [
			{ p: 'El tablero es un gran hexágono formado por 37 hexágonos más pequeños en los que se puede estar.' },
			{
				p: 'Cada uno de los cuatro equipos guarda sus piezas en su propio almacén junto al tablero, llamado **cuartel**. Todos los equipos empiezan con las mismas ocho piezas:',
			},
			{
				list: [
					'**5 agentes** — la infantería, 5 puntos cada uno',
					'**1 CEO** — 20 puntos, la pieza más valiosa del equipo',
					'**1 espía** — 10 puntos, escurridizo y difícil de fijar',
					'**1 francotirador** — 10 puntos, nunca se mueve pero golpea a distancia',
				],
			},
			{ p: 'Todas las piezas empiezan dentro de su cuartel. En el tablero no hay nada hasta que alguien las saca.' },
			{
				p: 'Cada pieza que está en el tablero **mira** además hacia una dirección. Eso no es adorno: hacia dónde mira decide a dónde puede ir, a qué puede golpear, y qué puede ver un francotirador a través de ella.',
			},
		],
	},
	{
		slug: 'getting-ready',
		group: 'Lo básico',
		title: 'Preparar la partida',
		teaser: 'De dos a seis jugadores. Un nombre cada uno. Un par de cartas secretas. Y empezáis.',
		image: {
			file: 'getting-ready.png',
			alt: 'La pantalla de nombres con dos jugadores escritos y un botón para repartir los alineamientos',
			caption: 'Los nombres primero, y luego las cartas dan la vuelta a la mesa',
		},
		body: [
			{
				p: 'Reunid de 2 a 6 jugadores y escribid vuestros nombres. El orden en que los escribís es el orden de los turnos.',
			},
			{
				p: 'Cada uno recibe una carta de **amigo** y una de **enemigo**, repartidas en secreto. Míralas, recuérdalas y déjalas boca abajo: vas a necesitar consultarlas durante toda la partida.',
			},
			{ p: 'Las 32 piezas empiezan en sus cuarteles. El tablero está completamente vacío.' },
			{ p: 'Empieza quien escribió su nombre primero. Después el juego da la vuelta a la mesa, un jugador cada vez.' },
			{
				note: '¿Jugáis en una sola pantalla? Las cartas se pasan de uno en uno, para que nadie más las vea. ¿Jugáis en línea? Cada jugador solo ve sus dos cartas: el servidor esconde las de los demás automáticamente.',
			},
		],
	},
	{
		slug: 'your-turn',
		group: 'Jugar un turno',
		title: 'Tu turno',
		teaser: 'Una acción de pieza. Después tantas jugadas gratis como quieras. Y pasas.',
		image: {
			file: 'your-turn.png',
			alt: 'La tira de turno y la barra de acciones, con un equipo recién reclamado y listo para desplegar',
			caption: 'Todo lo que puedes hacer en tu turno está en esta única barra',
		},
		body: [
			{
				p: 'En cada turno haces exactamente **una acción de pieza**: sacar una pieza al tablero, mover una, o girar un francotirador. Esa parte es obligatoria. No la puedes saltar.',
			},
			{ p: 'Junto a esa acción puedes hacer también cualquiera de estas, tantas veces como quieras y gratis:' },
			{
				list: [
					'**Reclamar un equipo**, o cambiar de idea antes de haber movido su CEO',
					'**Revelar** una de tus cartas (dos veces por partida como máximo — una por carta)',
					'**Acusar** a otro jugador, una y otra vez, mientras sigas acertando',
				],
			},
			{ p: 'Cuando hayas terminado, pulsa **PASAR TURNO**. El turno va al jugador siguiente.' },
			{
				note: 'No puedes pasar sin más. Si todas las piezas que te gustaría mover están atascadas, tienes que encontrar una que no lo esté: el botón no se enciende hasta que haya pasado algo de verdad.',
			},
			{
				p: 'Hay un botón en pantalla que nunca es tuyo: **¡DISPARO!** pertenece a todos *menos* al jugador que tiene el turno. Es la forma que tiene el resto de la mesa de responder al movimiento que acabas de hacer.',
			},
		],
	},
	{
		slug: 'making-a-move',
		group: 'Jugar un turno',
		title: 'Hacer un movimiento',
		teaser: 'Cógela. Suéltala. Apúntala a algún lado. Confirma — desde el tablero o directamente desde el cuartel.',
		imagesAtEnd: true,
		images: [
			{
				file: 'move-hq-idle.png',
				label: 'En reposo',
				alt: 'Un agente descansando en su cuartel, sin seleccionar',
				caption: 'En reposo, en el cuartel',
			},
			{
				file: 'move-hq-selected.png',
				label: 'Seleccionado',
				alt: 'El mismo agente seleccionado, y las casillas más cercanas del tablero encendidas en rojo',
				caption: 'Seleccionado — y el tablero responde',
			},
			{
				file: 'move-cells-highlighted.png',
				label: 'Casillas',
				alt: 'Casillas vacías encendidas en rojo alrededor de una pieza enemiga que no está encendida',
				caption: 'Se enciende cada casilla vacía — una ocupada nunca se enciende',
			},
			{
				file: 'move-placed-default.png',
				label: 'Colocado',
				alt: 'El agente recién colocado, mirando hacia su dirección por defecto',
				caption: 'Ha aterrizado, mirando hacia el único lado que puede antes de que lo apuntes',
			},
			{
				file: 'move-placed-turned.png',
				label: 'Apuntado',
				alt: 'El mismo agente mirando ahora hacia otra dirección después de un clic de apuntado',
				caption: 'Apuntado hacia otro lado — y esto es lo que lo confirma',
			},
		],
		body: [
			{
				p: 'Todas las piezas se mueven en los mismos cuatro tiempos, tanto si haces clic como si arrastras, y tanto si sale fresca de su cuartel como si ya estaba en el tablero:',
			},
			{
				list: [
					'**Selecciónala** — se encienden sus casillas legales',
					'**Muévela** — haz clic o suéltala en una casilla encendida',
					'**Apúntala** — pasa el ratón para elegir hacia dónde mira',
					'**Confirma** — haz clic para dejarla fija',
				],
			},
			{
				list: [
					'Tienes que mover antes de poder girar. El francotirador es la única excepción, porque girar *es* todo su movimiento.',
					'Seleccionar no cuesta nada. Solo confirmar un cambio real te gasta el turno.',
					'Sacar una pieza nueva de su cuartel funciona igual, y también te cuesta el turno entero: solo necesita una casilla de aterrizaje **vacía** y **fuera del alcance de los francotiradores enemigos**.',
				],
			},
			{
				note: 'Solo el jugador que controla un equipo puede sacar sus piezas — mira Tomar el control de un equipo.',
			},
			{
				note: 'El espía es la única pieza que no puede cambiar de idea una vez que empieza a moverse. Hay más sobre esto en su propia página.',
			},
			{
				note: 'Un CEO y un espía que ya están en el tablero se saltan los dos últimos tiempos: los dos miran hacia donde acaban de moverse, así que el movimiento se confirma solo y tu turno termina.',
			},
		],
	},
	{
		slug: 'the-agent',
		group: 'Las piezas',
		title: 'El agente',
		teaser: 'Cinco por equipo. Mueve dos casillas de frente. Mata lo que pisa.',
		images: [
			{
				file: 'agent-move.png',
				label: 'Mover',
				alt: 'Un agente seleccionado, con la única casilla dos por delante encendida en rojo',
				caption: 'Su única casilla legal: dos por delante, en línea recta',
			},
			{
				file: 'agent-kill.png',
				label: 'Matar',
				alt: 'Un agente seleccionado, con su casilla encendida ocupada ahora por una pieza enemiga',
				caption: 'Esa misma casilla, con un enemigo encima — aterrizar ahí es la muerte',
			},
		],
		body: [
			{ p: 'El agente mueve exactamente **dos casillas en línea recta**, hacia donde esté mirando.' },
			{
				list: [
					'Está bloqueado si hay **alguien** — amigo o enemigo — a una casilla por delante.',
					'Está bloqueado si hay una pieza **amiga** a dos casillas por delante.',
					'**Mata** aterrizando sobre un **enemigo** que esté dos casillas por delante.',
				],
			},
			{
				p: 'Después de moverse puede girar, pero solo un poco: de frente, o un paso a cada lado. Nunca hacia atrás.',
			},
			{
				p: 'Si lo sacas por el borde del tablero, no se cae: vuelve a entrar por cualquier casilla libre que quieras, exactamente como un despliegue nuevo.',
			},
			{
				note: 'Pon un agente al lado de su propio CEO y se vuelve más fuerte: puede mover una casilla *o* dos, y puede matar a solo una casilla por delante. Mira Mejoras del CEO.',
				buff: true,
			},
		],
	},
	{
		slug: 'the-ceo',
		group: 'Las piezas',
		title: 'El CEO',
		teaser: 'La pieza más valiosa del equipo, y la única que nunca puede matar.',
		images: [
			{
				file: 'ceo-move.png',
				label: 'Mover',
				alt: 'Un CEO seleccionado, con largas líneas de casillas encendidas en rojo en todas las direcciones',
				caption: 'Cualquier distancia, cualquiera de las seis direcciones — hasta donde llegue el tablero',
			},
			{
				file: 'ceo-blocked.png',
				label: 'Bloqueado',
				alt: 'Un CEO seleccionado, con sus casillas encendidas parándose justo antes de una pieza enemiga',
				caption: 'Se para justo antes del enemigo: un CEO nunca puede aterrizar sobre nadie, ni matarlo',
			},
		],
		body: [
			{
				p: 'El CEO mueve **cualquier distancia, en línea recta, en cualquiera de las seis direcciones**, hasta donde le dejen el tablero o la primera pieza que se le ponga por medio.',
			},
			{
				p: 'Se para justo antes de quien lo bloquea, amigo o enemigo. Ese es el precio de llegar tan lejos: el CEO **nunca puede matar**.',
			},
			{
				p: 'No gira por su cuenta: siempre mira hacia donde acaba de moverse. No hay nada que apuntar, así que **un solo clic lo mueve y lo deja puesto**, y tu turno termina.',
			},
			{
				p: 'Solo cuando lo sacas al tablero por primera vez lo apuntas hacia donde quieras: llega sin rumbo propio, así que lo apuntas y lo confirmas como cualquier otra pieza nueva.',
			},
			{ p: 'Por qué el CEO importa tanto:' },
			{
				list: [
					'**Mejora** a todas las piezas de su propio equipo que estén justo a su lado.',
					'Sacarlo al tablero es lo que convierte una reclamación en control de verdad.',
					'Si muere, **todas las piezas de su equipo que sigan esperando en el cuartel mueren con él.**',
					'La partida acaba en el instante en que cae el **tercer** CEO.',
				],
			},
		],
	},
	{
		slug: 'the-spy',
		group: 'Las piezas',
		title: 'El espía',
		teaser: 'Dos pasos rápidos, en zigzag hacia donde quiera — y una muerte por la espalda.',
		images: [
			{
				file: 'spy-move.png',
				label: 'Mover',
				alt: 'Un espía seleccionado, con las casillas vecinas en rojo para su primer paso y el anillo siguiente en turquesa para el segundo',
				caption: 'Rojo es este paso, turquesa el siguiente — todo el zigzag, servido',
			},
			{
				file: 'spy-kill.png',
				label: 'Matar',
				alt: 'Un espía seleccionado, con una pieza enemiga a dos casillas sobre una de las casillas turquesas del segundo paso, de espaldas',
				caption: 'A dos pasos y ya marcado — y está de espaldas, que es el único ángulo que cuenta',
			},
		],
		body: [
			{
				p: 'El espía da **dos pasos sueltos**, de casilla en casilla, eligiendo una dirección nueva en cada paso. Es decir, puede hacer zigzag por cualquier sitio a su alcance.',
			},
			{
				p: 'Su primer paso tiene que caer en una casilla **vacía**: un espía no puede matar de camino, solo justo al final.',
			},
			{
				p: 'No hace falta que calcules el zigzag de cabeza: mientras a un espía le queden pasos, el tablero marca a dónde podrían llegar los **siguientes**, cada uno de su color — **turquesa** para el segundo paso y **oro** para el tercero si está mejorado. Solo las casillas rojas son las que puedes pulsar ahora.',
			},
			{
				p: 'En su último paso puede matar, pero solo llegándole a un enemigo **por la espalda**: justo por detrás, o por uno de los dos rincones traseros. Si le llegas de cara o de lado, simplemente no es una opción.',
			},
			{
				p: 'Una vez que un espía ha dado su primer paso no hay marcha atrás: tienes que terminar los dos pasos antes de poder acabar el turno.',
			},
			{
				p: 'Al final no hay nada que apuntar en un espía: acaba **mirando hacia donde caminó**, así que su último paso lo deja fijo donde aterriza y tu turno termina. Salir de su cuartel es la única excepción: llega sin rumbo propio, así que lo apuntas como siempre.',
			},
			{ note: 'Al lado de su propio CEO, un espía gana un tercer paso en vez de dos.', buff: true },
		],
	},
	{
		slug: 'the-sniper',
		group: 'Las piezas',
		title: 'El francotirador',
		teaser: 'Una vez colocado no vuelve a moverse. No le hace falta.',
		imagesAtEnd: true,
		images: [
			{
				file: 'sniper-place.png',
				label: 'Colocar',
				alt: 'Todo el tablero, con todas las casillas de despliegue legales para un francotirador nuevo encendidas en rojo',
				caption: 'Todas las casillas donde se podría colocar — cada una con un tiro abierto desde ella',
			},
			{
				file: 'sniper-line.png',
				label: 'Línea',
				alt: 'Un francotirador en una esquina del tablero; una pieza de otro equipo seleccionada, con sus casillas legales encendidas menos en la diagonal que vigila el francotirador',
				caption: 'Las casillas legales de otro equipo se apagan en línea — esa línea es el tiro',
			},
			{
				file: 'sniper-blocked.png',
				label: 'Bloqueada',
				alt: 'El mismo tablero, pero una pieza a mitad de la línea ha devuelto la luz a las casillas que quedan detrás de ella',
				caption: 'La primera pieza que encuentra termina la línea: todo lo que queda detrás se vuelve a encender',
			},
			{
				file: 'sniper-kill.png',
				label: 'Matar',
				alt: 'Un francotirador encendido, que ha marcado a una pieza enemiga al cruzar su línea de tiro',
				caption: 'Encendido y con blanco marcado — ¡DISPARO! es la única forma en que mata',
			},
		],
		body: [
			{
				p: 'Una vez que un francotirador está en el tablero, no vuelve a moverse. Desde entonces, todo su «turno» consiste en elegir una dirección nueva hacia la que mirar.',
			},
			{
				p: 'Mirar hacia una dirección le da una **línea de tiro**: todas las casillas en línea recta hacia ese lado, parando en la primera pieza que encuentra — y esa pieza cuenta.',
			},
			{
				p: 'Solo se puede colocar donde tenga **al menos una** dirección sin enemigos por medio: desde donde esté siempre tiene que haber un tiro disponible.',
			},
			{
				p: 'Un francotirador no mata caminando encima de nadie. Mata **vigilando** — mira Francotiradores en acción para ver cómo funciona eso de verdad.',
			},
			{
				note: 'Pon un francotirador al lado de su propio CEO y su línea de tiro atraviesa las piezas, hasta el borde del tablero.',
				buff: true,
			},
		],
	},
	{
		slug: 'quick-reference',
		group: 'Las piezas',
		title: 'Referencia rápida',
		teaser: 'Las cuatro piezas, una al lado de la otra, para cuando se te olvide.',
		table: {
			// «Con mejora» y no «Mejorada»: la columna describe a cuatro piezas de géneros distintos
			// —el agente, el CEO, el espía, el francotirador— y un adjetivo tendría que concordar con
			// una de ellas y desafinar con las otras tres.
			headers: ['', 'Mueve', 'Mata', 'Con mejora'],
			rows: [
				['Agente', 'exactamente 2 de frente', 'al enemigo 2 de frente', '1 *o* 2 de frente; mata a 1'],
				['CEO', 'cualquier distancia, 6 direcciones', 'nunca', 'mejora a otros, no gana nada'],
				[
					'Espía',
					'1 casilla, dos veces, cualquier dirección',
					'al enemigo en el último paso, por la espalda',
					'1 casilla, tres veces',
				],
				['Francotirador', 'nunca — solo gira', 'con ¡DISPARO!', 've a través de las piezas'],
			],
		},
		body: [
			{
				p: 'Toda casilla de despliegue, para cualquier pieza, tiene que quedar además fuera de la línea de tiro de todos los francotiradores enemigos.',
			},
		],
	},
	{
		slug: 'killing',
		group: 'Combate y control',
		title: 'Matar',
		teaser: 'Aterriza encima y desaparecen — al cementerio.',
		image: {
			file: 'killing-hq.png',
			alt: 'La ficha del cuartel del equipo que hizo las muertes, con su cementerio marcando dos agentes y un espía',
			caption: 'Dos agentes y un espía, apuntados al pie de la ficha — el mérito va al cuartel del que mata',
		},
		body: [
			{
				p: 'Si una pieza termina su movimiento donde ya está otra, esa otra **muere**. Así de simple: el juego nunca te deja aterrizar donde matarías a un amigo, así que todo aterrizaje que te ofrece es la muerte de un enemigo.',
			},
			{
				p: 'Una pieza muerta va al cementerio del equipo que la mató, que es también lo que le da a ese equipo los puntos de la muerte.',
			},
			{
				p: 'Matar a un **CEO** es más grande que una muerte normal: todas las piezas de ese equipo que sigan esperando en su cuartel mueren también. Lo que ya tuvieran en el tablero queda intacto, y cualquiera puede seguir moviéndolo.',
			},
			{
				note: 'La muerte de un francotirador cuenta exactamente igual: se acredita a su propio equipo, como si le hubiera caminado encima.',
			},
		],
	},
	{
		slug: 'ceo-buffs',
		group: 'Combate y control',
		title: 'Mejoras del CEO',
		teaser: 'Ponte al lado de tu propio CEO y te vuelves más fuerte.',
		imagesAtEnd: true,
		images: [
			{
				file: 'buff-agent.png',
				label: 'Agente',
				alt: 'Un agente mejorado y brillante, con las casillas a una y a dos por delante encendidas en rojo',
				caption: 'Mejorado, se encienden las dos casillas alcanzables: una o dos por delante',
			},
			{
				file: 'buff-spy.png',
				label: 'Espía',
				alt: 'Un espía mejorado y brillante junto a su CEO, con el tablero marcado en tres anillos: rojo, turquesa y oro',
				caption: 'Tres pasos, tres colores — el anillo dorado es el alcance que dos pasos nunca tuvieron',
			},
			{
				file: 'buff-sniper.png',
				label: 'Francotirador',
				alt: 'El tablero con la línea oscura de un francotirador mejorado atravesando una pieza que la bloquea',
				caption: 'Mejorada, la línea atraviesa al bloqueador en vez de pararse en él',
			},
		],
		body: [
			{
				p: 'Cualquier pieza que esté justo al lado del CEO de **su propio equipo** recibe un empujón, recalculado de cero al principio de cada turno:',
			},
			{
				list: [
					'**Agente** — mueve 1 *o* 2 casillas de frente, y puede matar a solo 1 casilla',
					'**Espía** — gana un tercer paso en vez de dos',
					'**Francotirador** — su línea de tiro atraviesa ahora las piezas, hasta el borde',
					'**CEO** — nada. Un CEO no se mejora a sí mismo.',
				],
			},
			{
				p: 'Aquí el momento importa: las mejoras se calculan una sola vez, justo cuando empieza un turno nuevo. Si mueves una pieza al lado de un CEO a mitad de turno, no está mejorada hasta que empieza el turno *siguiente*.',
			},
		],
	},
	{
		slug: 'snipers-in-action',
		group: 'Combate y control',
		title: 'Francotiradores en acción',
		teaser: 'La única jugada que no es tuya: pertenece al resto de la mesa.',
		images: [
			{
				file: 'snipe-before.png',
				label: 'Antes',
				alt: 'Una pieza fuera de la línea de tiro de un francotirador',
				caption: 'Fuera de la línea — por ahora',
			},
			{
				file: 'snipe-crossed.png',
				label: 'Cruzada',
				alt: 'La misma pieza, justo después de moverse cruzando la línea de tiro del francotirador',
				caption: 'La ha cruzado: está marcada, aunque nada lo muestre todavía',
			},
			{
				file: 'snipe-armed.png',
				label: '¡Disparo!',
				alt: 'El francotirador encendido, con la pieza que cruzó su línea marcada',
				caption: '¡DISPARO! pulsado — la marca enciende al francotirador',
			},
			{
				file: 'snipe-after.png',
				label: 'Después',
				alt: 'El tablero después del disparo, con la pieza marcada desaparecida',
				caption: 'Disparado: la pieza ya no está y el turno ha pasado',
			},
		],
		body: [
			{
				p: 'Cada vez que una pieza entra en la línea de tiro de un francotirador enemigo, sale de ella o la **atraviesa**, ese francotirador la marca. Se comprueba todo el recorrido, no solo dónde acaba: cruza la línea y sigue andando, y sigues marcado.',
			},
			{
				p: 'Y aquí está la vuelta de tuerca: el tiro no es de quien tiene el turno. **¡DISPARO! pertenece a todos los demás.** Es la forma en que el resto de la mesa responde al movimiento que se acaba de hacer.',
			},
			{
				p: 'Pulsa ¡DISPARO! y se enciende cada francotirador que tenga un blanco marcado. Haz clic en uno encendido y pasan tres cosas a la vez:',
			},
			{
				list: [
					'**Muere toda pieza que haya marcado.**',
					'**El resto del tablero vuelve atrás** a como estaba al principio del turno: el movimiento se deshace, y con él todo lo que hizo.',
					'**El turno termina** y pasa como siempre.',
				],
			},
			{
				p: 'Solo tienes una ventana para disparar: el mismo turno en el que ocurrió el movimiento. En cuanto se pulsa PASAR TURNO, la marca desaparece para siempre.',
			},
			{
				note: 'Pulsar ¡DISPARO! congela el tablero: no se puede hacer clic en nada más hasta que se toma el tiro. No se puede apuntar y luego cambiar de idea.',
			},
		],
	},
	{
		slug: 'taking-control',
		group: 'Combate y control',
		title: 'Tomar el control de un equipo',
		teaser: 'Solo quien controla un equipo puede sacar sus piezas al tablero.',
		imagesAtEnd: true,
		imageGroups: [
			[
				{
					file: 'control-claim-click.png',
					label: 'Reclamar',
					alt: 'El cuartel de un equipo sin reclamar, con su botón de reclamar',
					caption: 'Pulsa RECLAMAR',
				},
				{
					file: 'control-place-ceo.png',
					label: 'Colocar el CEO',
					alt: 'El CEO de ese equipo aterrizando en el tablero',
					caption: 'Saca su CEO al tablero',
				},
				{
					file: 'control-alice.png',
					label: 'Control: Alice',
					alt: 'La ficha del cuartel diciendo ahora CONTROL: ALICE',
					caption: 'El equipo es de verdad suyo',
				},
			],
			[
				{
					file: 'control-reveal-click.png',
					label: 'Revelar',
					alt: 'Una carta de amigo puesta boca arriba, que nombra al amarillo',
					caption: 'Poner una de tus cartas boca arriba',
				},
				{
					file: 'control-bob.png',
					label: 'Control: Bob',
					alt: 'La ficha del cuartel de ese equipo diciendo ahora CONTROL: BOB',
					caption: 'Suyo al momento, sin ningún CEO',
				},
			],
		],
		body: [
			{ p: 'Puedes tener el control de **un equipo a la vez**. Coger un segundo equipo suelta el primero.' },
			{ p: 'Hay dos formas de tomar el control:' },
			{
				list: [
					'**Reclamarlo y desplegar su CEO.** Pulsa el botón RECLAMAR de ese equipo y saca su CEO al tablero. En el momento en que aterriza, el equipo es de verdad tuyo.',
					'**Revelar una carta que lo nombre.** Poner una de tus cartas boca arriba te entrega ese equipo al momento, con su CEO en el tablero o sin él.',
				],
			},
			{
				p: 'Solo quien controla el equipo puede sacar piezas nuevas de su cuartel. Lo que ya tenga en el tablero es propiedad pública: lo mueve cualquiera que tenga el turno.',
			},
			{
				note: 'Un equipo cuyo CEO ya está en el tablero no se puede reclamar de esta forma. Desde ahí, la única manera de quitárselo a alguien es revelar una carta que lo nombre.',
			},
		],
	},
	{
		slug: 'revealing',
		group: 'Cartas sobre la mesa',
		title: 'Revelar',
		teaser: 'Pones una carta boca arriba. Te cuesta 50 puntos, y te entrega un equipo.',
		image: {
			file: 'revealing.png',
			alt: 'Una carta de amigo puesta boca arriba, que nombra al negro, junto a una carta de enemigo aún en blanco',
			caption: 'Una carta arriba, la otra todavía secreta',
		},
		body: [
			{
				p: 'En tu turno, pulsa REVELAR y pon tu carta de amigo o de enemigo boca arriba. Una vez arriba, se queda arriba el resto de la partida.',
			},
			{
				p: 'Te cuesta **50 puntos** de tu puntuación final. Da la vuelta a las dos cartas y son 100 puntos que se van.',
			},
			{ p: 'A cambio, ese equipo es tuyo **al momento**, sin ningún CEO de por medio.' },
			{
				p: 'Revelar no te gasta el turno. Puedes hacer igualmente tu movimiento de pieza, e incluso puedes revelar las dos cartas en el mismo turno si quieres.',
			},
		],
	},
	{
		slug: 'accusing',
		group: 'Cartas sobre la mesa',
		title: 'Acusar',
		teaser: 'Adivina el secreto de alguien. Acierta, y lo paga esa persona en vez de ti.',
		image: {
			file: 'accusing.png',
			alt: 'El veredicto de una acusación acertada, que nombra al equipo enemigo del jugador acusado',
			caption: 'Una apuesta que salió bien — y 50 puntos de otro',
		},
		body: [
			{ p: 'En tu turno, pulsa ACUSAR, elige a otro jugador, elige amigo o enemigo, y nombra un equipo.' },
			{
				p: '**Si aciertas**, su carta se pone boca arriba: paga los mismos 50 puntos que cuesta revelar por voluntad propia. Y lo mejor es que a *ti* no te cuesta nada, y puedes volver a acusar.',
			},
			{
				p: '**Si fallas**, no podrás volver a acusar esa carta el resto de la partida. Si te equivocas con el amigo de alguien, has perdido el derecho a adivinar el amigo de nadie, nunca más — tus acusaciones de enemigo quedan intactas.',
			},
			{ p: 'Acusar tampoco te gasta el turno. Si sigues acertando, puedes seguir.' },
			{
				note: 'Una acusación acertada no te da el control de ese equipo. Eso solo lo hace revelar por voluntad propia.',
			},
		],
	},
	{
		slug: 'how-it-ends',
		group: 'Ganar',
		title: 'Cómo termina',
		teaser: 'Cae el tercer CEO, y salen todas las cartas.',
		image: {
			file: 'how-it-ends.png',
			alt: 'La hoja de puntuación final, con el total de cada jugador y el recuento de cada equipo',
			caption: 'Todas las cartas boca arriba, todos los puntos sobre la mesa',
		},
		body: [
			{
				p: 'La partida acaba en el instante en que muere el **tercer CEO**. Queda un equipo en pie con su CEO vivo.',
			},
			{
				p: 'Todas las cartas de alineamiento se ponen boca arriba —amigos y enemigos—, porque para saber quién ha ganado hay que verlas todas.',
			},
			{ p: 'Así se calcula tu puntuación:' },
			{
				list: [
					'Empiezas en **100**.',
					'**Pierdes 50** por cada carta tuya que haya acabado boca arriba, la revelaras tú o la acertara otro.',
					'**Sumas** los puntos de tu equipo amigo.',
					'**Restas** los puntos de tu equipo enemigo.',
				],
			},
			{
				p: 'Los puntos propios de un equipo salen del valor de todo lo que mató, más el valor de sus piezas que sigan en pie en el tablero. Lo que siga esperando en el cuartel no cuenta nada: quedarse fuera no es lo mismo que sobrevivir.',
			},
			{ p: '**Gana quien tenga la puntuación más alta.**' },
			{
				note: 'Levanta a tu amigo, hunde a tu enemigo, e intenta que no te lean: los 50 puntos que pagas por hacerte con un equipo son exactamente el precio de que toda la mesa sepa qué buscas.',
			},
		],
	},
	{
		slug: 'playing-online',
		group: 'Ganar',
		title: 'Jugar en línea',
		teaser: 'Las mismas reglas. Gente de verdad, donde esté.',
		image: {
			file: 'playing-online.png',
			alt: 'La pantalla de «Entrar en una partida» del vestíbulo, con una sala pública en la lista',
			caption: 'Una sala, un código y un asiento esperándote',
		},
		body: [
			{
				p: 'Todo lo de estas páginas funciona exactamente igual si juegas en línea o en una sola pantalla compartida. Lo que añade jugar en línea es sencillo:',
			},
			{
				list: [
					'**Las salas** tienen hasta 6 asientos y se abren con un código corto que puedes compartir.',
					'**Tus cartas son solo tuyas.** La gente con la que juegas ni siquiera las recibe: el servidor solo te envía a ti tus dos cartas.',
					'**Solo actúa quien tiene el turno** — salvo ¡DISPARO!, que pertenece a todos los demás, igual que en una sola pantalla.',
					'**Un portátil cerrado no puede parar la partida.** Si alguien desaparece un minuto, cualquiera puede pulsar PASAR TURNO por él.',
				],
			},
			{
				p: 'Abre «Crear partida» para montar tu propia mesa, o «Entrar en una partida» para encontrar una que ya te esté esperando.',
			},
		],
	},
];

export default RULES_PAGES;
