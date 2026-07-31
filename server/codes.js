import { randomInt, randomUUID } from 'node:crypto';

// Room codes get read aloud and typed by hand, so the alphabet drops every character that gets
// confused for another: no O/0, no I/1, no S/5.
const ALPHABET = 'ABCDEFGHJKLMNPQRTUVWXYZ2346789';
const CODE_LENGTH = 4;
const MAX_ATTEMPTS = 200;

export function createCode(isTaken = () => false) {
	for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
		let code = '';

		for (let i = 0; i < CODE_LENGTH; i++) {
			code += ALPHABET[randomInt(ALPHABET.length)];
		}

		if (!isTaken(code)) {
			return code;
		}
	}

	// 30^4 is ~810k codes; exhausting 200 attempts means the room cap is broken, not bad luck.
	throw new Error('could not allocate a free room code');
}

export function isCodeShaped(value) {
	return typeof value === 'string' && new RegExp(`^[${ALPHABET}]{${CODE_LENGTH}}$`).test(value);
}

// Bearer token for a seat, so a refresh or a dropped connection can reclaim it.
export function createToken() {
	return randomUUID();
}

export { CODE_LENGTH, ALPHABET };
