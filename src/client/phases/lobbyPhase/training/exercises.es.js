// El curso en castellano: solo las palabras.
//
// `exercises.js` sigue siendo el curso — los tableros, las puertas de cada paso y la condición que
// lo cierra están allí y en un solo sitio. Aquí no hay ni una regla: una traducción que pudiera
// mover una casilla sería una lección distinta, y la mitad que se rompe sola es siempre la que se
// escribe dos veces.
//
// `steps` va en paralelo a los pasos del ejercicio, en el mismo orden. Un `hint` que falta es un
// paso que no lo tiene; el test de idiomas comprueba que los dos cursos tienen la misma longitud.
//
// Los verbos son infinitivos porque son instrucciones, y son cortos porque van estampados: COGER
// y SOLTAR se leen como un par, que es exactamente lo que son.

export const EXERCISES_ES = {
	cards: {
		title: 'Amigo y enemigo',
		finding: 'Dos cartas. Nadie más las ve.',
		steps: [{ verb: 'MIRAR' }, { verb: 'MIRAR' }],
	},

	move: {
		title: 'Hacer un movimiento',
		finding: 'Una acción de pieza, y pasas.',
		steps: [
			{ verb: 'COGER' },
			{ verb: 'MOVER' },
			{ verb: 'APUNTAR', hint: 'pulsa hacia donde debe mirar' },
			{ verb: 'PASAR' },
		],
	},

	agent: {
		title: 'El agente',
		finding: 'Dos de frente. Aterrizar mata.',
		steps: [{ verb: 'COGER' }, { verb: 'ATACAR' }, { verb: 'SOLTAR' }],
	},

	ceo: {
		title: 'El CEO',
		finding: 'Cualquier distancia. Nunca mata.',
		steps: [{ verb: 'COGER' }, { verb: 'MOVER' }],
	},

	spy: {
		title: 'El espía',
		finding: 'Dos pasos. Mata solo por la espalda.',
		steps: [
			{ verb: 'COGER', hint: 'rojo es ahora, turquesa después' },
			{ verb: 'AVANZAR' },
			{ verb: 'ATACAR', hint: 'el que está de espaldas' },
		],
	},

	sniper: {
		title: 'El francotirador',
		finding: 'El disparo es de los demás.',
		note: 'Y una línea de tiro se para en la primera pieza que esté en ella.',
		steps: [
			{ verb: 'COGER' },
			{ verb: 'MOVER' },
			{ verb: 'SOLTAR' },
			{ verb: 'DISPARO', hint: 'esto lo pulsa otro jugador' },
			{ verb: 'FUEGO' },
			{ verb: 'PASAR' },
			{ verb: 'COGER' },
			{ verb: 'MOVER', hint: 'esta vez pisa la línea' },
			{ verb: 'SOLTAR', hint: 'todo lo que hay detrás ya está a salvo' },
		],
	},

	buff: {
		title: 'Mejoras del CEO',
		finding: 'Junto a su CEO, la pieza gana más.',
		note: 'Se calcula una vez, al principio de cada turno; nunca a mitad.',
		steps: [
			{ verb: 'COGER', hint: 'el espía: tres anillos, no dos' },
			{ verb: 'SOLTAR' },
			{ verb: 'COGER', hint: 'el francotirador, y hacia dónde mira' },
			{ verb: 'APUNTAR', hint: 'pulsa arriba a la derecha' },
			{ verb: 'PASAR' },
			{ verb: 'COGER', hint: 'el agente: no tiene a dónde ir' },
			{ verb: 'SOLTAR' },
			{ verb: 'COGER', hint: 'ahora el CEO' },
			{ verb: 'MOVER', hint: 'junto al agente atascado' },
			{ verb: 'PASAR' },
			{ verb: 'COGER', hint: 'el muro ya es un objetivo' },
			{ verb: 'ATACAR' },
		],
	},

	control: {
		title: 'Tomar el control',
		finding: 'Reclámalo y aterriza su CEO.',
		note: 'Ya nadie más puede sacar a ese equipo de su cuartel.',
		steps: [{ verb: 'RECLAMAR' }, { verb: 'DESPLEGAR', hint: 'donde sea' }, { verb: 'SOLTAR' }],
	},

	reveal: {
		title: 'Revelar',
		finding: 'Cincuenta puntos menos al final.',
		note: 'Y el equipo que nombra la carta es tuyo al momento, sin desplegar ningún CEO.',
		steps: [{ verb: 'REVELAR' }, { verb: 'MOSTRAR', hint: 'la carta de amigo' }, { verb: 'CERRAR' }],
	},

	accuse: {
		title: 'Acusar',
		finding: 'Si aciertas paga el otro, no tú.',
		steps: [{ verb: 'ACUSAR' }, { verb: 'ADIVINAR' }, { verb: 'CERRAR' }],
	},
};

export default EXERCISES_ES;
