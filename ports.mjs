// Local dev ports, in one place because four things have to agree on them: vite (dev and preview),
// the playwright webServer block, dev.sh, and .vscode/launch.json. When they disagreed the symptom
// was a client whose /ws proxy pointed at nothing, which looks exactly like a client bug.
//
// The numbers come from ~/Projects/LOCAL_PORTS.md, the machine-wide registry that exists so every
// project can run at once. hidden-agenda holds 3017/3018 in the apps band. **They are not arbitrary
// and not free to change**: 3007, which this project used to take, is ottobot's backend, and 9229 —
// node's default, which the inspector used to sit on — is claimed by kosmos, b2-sim and
// streaming-platform. Both collisions fail as "port already in use" at startup, and from inside an
// editor that surfaces as nothing more useful than "errors exist after running preLaunchTask".
//
// This governs local dev only. Production is PORT=3007 in deploy/pm2/ecosystem.config.cjs with
// nginx proxying to it, and DEFAULT_PORT in server/index.js still matches that — the VPS has no
// ottobot to collide with, and nothing here reaches the box.

export const CLIENT_PORT = 3017;
export const SERVER_PORT = 3018;

// Not 9229. Every editor's default node attach lands there, so with three other projects on it a
// stale session steals this one's inspector.
export const INSPECT_PORT = 9559;
