import { test, expect } from '@playwright/test';
import {
	ADJECTIVES,
	NOUNS,
	isRoomNameShaped,
	matchesRoomQuery,
	normaliseRoomName,
	pickRoomName,
	MAX_ROOM_NAME_LENGTH,
} from 'Domain/roomNames';

// A room name is the only string in this game that a player types and other players then search
// for, so the three things that matter are that a drawn one always passes validation, that the
// validation is the same at both ends of the wire, and that searching is forgiving about the one
// difference nobody can see: whether the separator was a space or a hyphen.

test.describe('room names', () => {
	test('a drawn name is two themed words, and every possible draw is a legal name', () => {
		// The client prefills the field with a draw and the server refuses a malformed name, so a
		// single unlucky combination that failed its own validation would be a room nobody could open
		// and no test would find. Checking the whole cross product is cheap — 3600 names — and rules
		// it out for good rather than for one seed.
		expect(ADJECTIVES.length).toBeGreaterThan(40);
		expect(NOUNS.length).toBeGreaterThan(40);

		for (const adjective of ADJECTIVES) {
			for (const noun of NOUNS) {
				const name = `${adjective}-${noun}`;

				expect(isRoomNameShaped(name), name).toBe(true);
				expect(name.length, name).toBeLessThanOrEqual(MAX_ROOM_NAME_LENGTH);
			}
		}
	});

	test('the draw takes an rng, so a spec and the server can both make it deterministic', () => {
		expect(pickRoomName(() => 0)).toEqual(`${ADJECTIVES[0]}-${NOUNS[0]}`);
		// A generator that returns exactly 1 must not index past the end of either list.
		expect(pickRoomName(() => 1)).toEqual(`${ADJECTIVES[0]}-${NOUNS[0]}`);
	});

	test('a name is letters, digits, spaces and hyphens, and has to be sayable', () => {
		expect(isRoomNameShaped('secret-agent')).toBe(true);
		expect(isRoomNameShaped('Table 4')).toBe(true);
		expect(isRoomNameShaped('ab')).toBe(false);
		expect(isRoomNameShaped('   ')).toBe(false);
		expect(isRoomNameShaped('')).toBe(false);
		expect(isRoomNameShaped(null)).toBe(false);
		expect(isRoomNameShaped(42)).toBe(false);
		expect(isRoomNameShaped('a'.repeat(MAX_ROOM_NAME_LENGTH + 1))).toBe(false);
		// Nothing here is rendered as markup, but a name that leads with punctuation or carries any
		// is a room that cannot be read out over a phone, which is the whole job of having a name.
		expect(isRoomNameShaped('<script>')).toBe(false);
		expect(isRoomNameShaped('-leading')).toBe(false);
		expect(isRoomNameShaped('quotes"in it')).toBe(false);
	});

	test('normalising collapses the whitespace nobody can see', () => {
		expect(normaliseRoomName('  secret   agent  ')).toEqual('secret agent');
		expect(normaliseRoomName('secret---agent')).toEqual('secret-agent');
		expect(normaliseRoomName(undefined)).toEqual('');
	});

	test('searching treats a space and a hyphen as the same separator', () => {
		// Somebody reads `secret-agent` off another player's screen and types what they say out loud.
		expect(matchesRoomQuery('secret-agent', 'secret agent')).toBe(true);
		expect(matchesRoomQuery('secret agent', 'secret-agent')).toBe(true);
		expect(matchesRoomQuery('secret-agent', 'AGENT')).toBe(true);
		expect(matchesRoomQuery('secret-agent', 'cunning')).toBe(false);
		// An empty query is not a filter; it is the whole list.
		expect(matchesRoomQuery('secret-agent', '')).toBe(true);
		expect(matchesRoomQuery('secret-agent', '   ')).toBe(true);
	});
});
