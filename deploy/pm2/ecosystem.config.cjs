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
			},
			out_file: '/var/log/hidden-agenda/out.log',
			error_file: '/var/log/hidden-agenda/error.log',
			merge_logs: true,
			time: true,
		},
	],
};
