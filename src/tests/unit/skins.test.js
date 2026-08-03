import { test, expect } from '@playwright/test';
import { DEFAULT_SKIN, isSkin, pickSkin, SKINS, SKIN_NAMES } from 'Domain/skins';
import { createRoomStore } from '../../../server/rooms';
import { roomMessage } from '../../../server/protocol';

// The skin is not decoration as far as these specs are concerned — it is a piece of room state that
// every seat has to agree on, which makes it the same kind of thing as the phase.

test.describe('pickSkin', () => {
	test('only ever returns a real skin', () => {
		// Walk the whole unit interval rather than trusting one draw. The off-by-one that matters is
		// rng() returning exactly 1, which floors to SKIN_NAMES.length and would index past the end.
		for (let i = 0; i <= 100; i++) {
			expect(SKIN_NAMES).toContain(pickSkin(() => i / 100));
		}
	});

	test('keeps the default in the draw', () => {
		// "Maintain dossier" is one of the three outcomes, not a failure to change.
		expect(pickSkin(() => 0)).toBe(DEFAULT_SKIN);
	});

	test('can reach all three', () => {
		const reached = new Set(SKIN_NAMES.map((_, i) => pickSkin(() => i / SKIN_NAMES.length)));

		expect([...reached].sort()).toEqual([...SKIN_NAMES].sort());
	});

	test('isSkin refuses anything that is not one', () => {
		expect(isSkin(SKINS.VAULT)).toBe(true);
		expect(isSkin('wire')).toBe(false);
		expect(isSkin(undefined)).toBe(false);
		expect(isSkin('')).toBe(false);
	});
});

test.describe('a room owns its skin', () => {
	test('draws one when the room is made', () => {
		const rooms = createRoomStore({ rng: () => 0.9 });

		expect(SKIN_NAMES).toContain(rooms.create().skin);
	});

	test('two rooms can differ', () => {
		// Whoever opens a room gets a draw of their own; the room next door is not bound by it.
		const first = createRoomStore({ rng: () => 0 }).create();
		const second = createRoomStore({ rng: () => 0.9 }).create();

		expect(first.skin).not.toBe(second.skin);
	});

	test('the skin is on the room frame, which is what every seat receives', () => {
		const rooms = createRoomStore({ skin: SKINS.BLUEPRINT });
		const room = rooms.create();

		rooms.addSeat(room, 'Nadia');
		rooms.addSeat(room, 'Halloran');

		// One frame, one skin, sent to everybody: that is what makes the waiting room look the same
		// on two screens without the clients having to negotiate anything.
		expect(roomMessage(room).skin).toBe(SKINS.BLUEPRINT);
	});

	test('survives being started, so the game keeps the room’s look', () => {
		const rooms = createRoomStore({ skin: SKINS.VAULT });
		const room = rooms.create();

		rooms.addSeat(room, 'Nadia');
		rooms.addSeat(room, 'Halloran');
		rooms.start(room);

		expect(room.skin).toBe(SKINS.VAULT);
		expect(roomMessage(room).skin).toBe(SKINS.VAULT);
	});

	test('adding the skin did not widen the room frame', () => {
		// The skin is public; alignments never are. Adding a public field to the frame every seat
		// receives is exactly the kind of change that could quietly carry a secret with it, so this
		// pins the whole shape rather than grepping for a word — "alignment" is also a phase name,
		// which is how the first version of this assertion passed for the wrong reason.
		const rooms = createRoomStore({ skin: SKINS.DOSSIER });
		const room = rooms.create();

		rooms.addSeat(room, 'Nadia');
		rooms.addSeat(room, 'Halloran');
		rooms.start(room);

		const frame = roomMessage(room);

		expect(Object.keys(frame).sort()).toEqual(['code', 'hostSeatId', 'phase', 'seats', 'skin', 'type']);
		expect(frame.seats.map(seat => Object.keys(seat).sort())).toEqual([
			['connected', 'id', 'name', 'ready'],
			['connected', 'id', 'name', 'ready'],
		]);
	});
});
