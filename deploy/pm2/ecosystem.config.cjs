// PM2 app definition. CommonJS on purpose — PM2 reads its config with require().
//
//   cd /opt/hidden-agenda && pm2 start deploy/pm2/ecosystem.config.cjs && pm2 save
//
// The bundle is committed, so there is nothing to build on the box. It runs on the box's node 18:
// vite.server.config.mjs targets node18 deliberately, even though the toolchain needs 22 to build.
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
