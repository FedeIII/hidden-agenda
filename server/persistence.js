import { mkdirSync, readdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Rooms survive a restart. Deploys reload PM2, and without this every game in progress would
// die on every deploy. Rooms are plain JSON precisely so this can be a file each.
//
// Best-effort by design: a laptop cannot write to /var/lib, and a game that cannot be persisted
// is still a perfectly good game. Failing to save must never take the server down.

export const DEFAULT_STATE_DIR = '/var/lib/hidden-agenda/rooms';

export function createRoomPersistence({ dir = process.env.HA_STATE_DIR || DEFAULT_STATE_DIR, log = () => {} } = {}) {
	let enabled = true;

	try {
		mkdirSync(dir, { recursive: true });
	} catch (error) {
		enabled = false;
		log(`room persistence disabled (${dir}: ${error.code || error.message})`);
	}

	function fileFor(code) {
		return join(dir, `${code}.json`);
	}

	return {
		get enabled() {
			return enabled;
		},

		// tmp + rename, so a crash mid-write cannot leave a half-written room to be read back.
		save(room) {
			if (!enabled) {
				return;
			}

			const target = fileFor(room.code);
			const tmp = `${target}.tmp`;

			try {
				writeFileSync(tmp, JSON.stringify(room), 'utf8');
				renameSync(tmp, target);
			} catch (error) {
				log(`could not save room ${room.code}: ${error.message}`);
			}
		},

		remove(code) {
			if (!enabled) {
				return;
			}

			try {
				unlinkSync(fileFor(code));
			} catch (error) {
				if (error.code !== 'ENOENT') {
					log(`could not remove room ${code}: ${error.message}`);
				}
			}
		},

		loadAll() {
			if (!enabled) {
				return [];
			}

			try {
				return (
					readdirSync(dir)
						.filter(name => name.endsWith('.json'))
						.map(name => {
							try {
								return JSON.parse(readFileSync(join(dir, name), 'utf8'));
							} catch (error) {
								log(`skipping unreadable room file ${name}: ${error.message}`);

								return null;
							}
						})
						.filter(Boolean)
						// Nothing is connected after a restart, whatever the file says.
						.map(room => ({
							...room,
							seats: room.seats.map(seat => ({ ...seat, connected: false })),
						}))
				);
			} catch (error) {
				log(`could not read room directory: ${error.message}`);

				return [];
			}
		},
	};
}

export default createRoomPersistence;
