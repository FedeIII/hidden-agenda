// PM2 app definition. CommonJS on purpose — PM2 reads its config with require().
//
//   cd /opt/hidden-agenda && pm2 start deploy/pm2/ecosystem.config.cjs && pm2 save
//
// The bundle is committed, so there is nothing to build on the box. Originally deployed against the
// box's node 18 (vite.server.config.mjs still targets node18 for that reason, even though the
// toolchain needs 22 to build); the box itself is on node 24.19 as of 2026-08-05 (see deploy/README.md).
module.exports = {
	apps: [
		{
			name: 'hidden-agenda',
			script: 'dist-server/main.mjs',
			cwd: '/opt/hidden-agenda',
			exec_mode: 'fork',
			instances: 1,
			autorestart: true,
			max_memory_restart: '200M',
			// TURNSTILE_SECRET lives in /opt/hidden-agenda/.env on the box only — never committed, never
			// known to this file — and node reads it itself at every start/reload/restart. Deliberately
			// not forwarded through PM2's own `env` block: that would depend on --update-env re-reading
			// *this process's* environment at the moment `pm2 reload` runs, which is exactly the kind of
			// thing a non-interactive deploy script cannot guarantee. `-if-exists` so a box (or a
			// developer's machine reusing this file) with no such file starts exactly as before — the
			// same best-effort shape as persistence and ratings: server/turnstile.js reads an absent
			// secret as "disabled" and logs it, rather than refusing every request.
			node_args: '--env-file-if-exists=.env',
			// Rooms are small and in memory; if this grows unbounded something is leaking.
			env: {
				NODE_ENV: 'production',
				PORT: '3007',
				// Loopback only. Nothing reaches this except through nginx.
				HOST: '127.0.0.1',
				HA_STATE_DIR: '/var/lib/hidden-agenda/rooms',
				// Ratings, and **not** a path inside HA_STATE_DIR. The room loader reads every *.json in
				// its own directory and hands each one to the room store, so one foreign file there throws,
				// the catch returns an empty list, and every game in progress is dropped on the next
				// restart. A sibling directory, which step 4 of the deploy README creates alongside it.
				HA_RATINGS_DIR: '/var/lib/hidden-agenda/ratings',
			},
			out_file: '/var/log/hidden-agenda/out.log',
			error_file: '/var/log/hidden-agenda/error.log',
			merge_logs: true,
			time: true,
		},
	],
};
