#!/usr/bin/env bash
#
# Launches a complete local dev environment: the game server, a watcher that rebuilds it, and the
# vite dev server. The client always talks to /ws on its own origin (vite proxies it to the game
# server, the same shape nginx serves on the VPS), so online play works locally with no config.
#
#   ./dev.sh                 client + server, opens a browser
#   ./dev.sh --preview       build docs/ and serve that instead — what the e2e suite runs
#   ./dev.sh --inspect       server under the node inspector (see ports.mjs)
#   ./dev.sh --no-server     client only (run the server yourself, or from the debugger)
#   ./dev.sh --no-open       don't open a browser
#   ./dev.sh --clean         drop persisted rooms before starting
#
# Ctrl-C stops everything.

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

# Cursor and VS Code inject these into a task's terminal so their JS debugger auto-attaches to every
# node process below it. That is wrong for a supervisor: it attaches to vite and to the rebuild
# watcher as well as the server, and when the debug session ends its teardown SIGTERMs this script
# and takes the whole env down with it. --inspect is how you debug the server here; the "Attach:
# game server" launch config connects to it deliberately.
unset NODE_OPTIONS VSCODE_INSPECTOR_OPTIONS

# Persisted rooms. The server's default is /var/lib, which is not writable on a dev machine, so
# persistence would quietly disable itself — meaning every server rebuild would drop the game in
# progress. Pointing it at the repo lets a watch restart survive an in-flight game.
STATE_DIR=.dev-rooms
# Ratings, same reasoning, and deliberately **not** inside STATE_DIR: the room loader reads every
# *.json in its own directory and hands it to the room store, so one foreign file there is enough to
# make it throw and drop every game in progress on the next restart.
RATINGS_DIR=.dev-ratings
# The join limit is per IP and every tab here shares one. Six seats plus a few reloads trips the
# production limit of 10 in a way that looks nothing like a rate limit, so raise it for dev only.
JOINS_PER_MINUTE=1000

open_browser=1
preview=0
run_server=1
inspect=0
clean=0

while [ $# -gt 0 ]; do
	case "$1" in
		--no-open) open_browser=0 ;;
		--preview) preview=1 ;;
		--no-server) run_server=0 ;;
		--inspect) inspect=1 ;;
		--clean) clean=1 ;;
		-h | --help)
			# The header comment above, minus the shebang, up to the first blank line.
			awk 'NR > 2 && /^#/ { sub(/^# ?/, ""); print; next } NR > 2 { exit }' "$0"
			exit 0
			;;
		*)
			echo "dev.sh: unknown option $1 (try --help)" >&2
			exit 2
			;;
	esac
	shift
done

if [ -t 1 ]; then
	BOLD=$'\033[1m' DIM=$'\033[2m' RESET=$'\033[0m'
	BLUE=$'\033[34m' GREEN=$'\033[32m' YELLOW=$'\033[33m' RED=$'\033[31m'
else
	BOLD='' DIM='' RESET='' BLUE='' GREEN='' YELLOW='' RED=''
fi

note() { printf '%s∙%s %s\n' "$BOLD" "$RESET" "$1"; }
fail() {
	printf '%s✗%s %s\n' "$RED" "$RESET" "$1" >&2
	exit 1
}

# --- preflight ---------------------------------------------------------------------------------

# Printed before anything can fail, so the editor has one line to recognise a run by — the tasks in
# .vscode/tasks.json use it as their beginsPattern. A preflight failure below happens before the
# first build in every mode, and a background task whose beginsPattern had not matched yet reports
# the failure as an unexplained "errors exist after running preLaunchTask".
printf '%shidden-agenda dev env%s\n' "$BOLD" "$RESET"

node_major=$(node -v 2>/dev/null | sed 's/^v\([0-9]*\).*/\1/') || fail "node is not on PATH"
[ "${node_major:-0}" -ge 22 ] || fail "node $(node -v) — this toolchain needs 22 (see .nvmrc; \`nvm use\`)"

[ -d node_modules ] || {
	note "node_modules missing, installing"
	npm install
}

# Read from ports.mjs rather than duplicated here: vite and playwright import that same module, and
# a number that disagrees with vite's proxy target is a client that cannot reach the server while
# looking perfectly healthy. One node startup buys the guarantee.
eval "$(node -e 'import("./ports.mjs").then(p =>
	console.log(`CLIENT_PORT=${p.CLIENT_PORT} SERVER_PORT=${p.SERVER_PORT} INSPECT_PORT=${p.INSPECT_PORT}`))' ||
	echo 'PORTS_FAILED=1')"
[ -z "${PORTS_FAILED:-}" ] && [ -n "${CLIENT_PORT:-}" ] && [ -n "${SERVER_PORT:-}" ] && [ -n "${INSPECT_PORT:-}" ] ||
	fail "could not read the ports from ports.mjs"

check_port() {
	local pid
	# lsof exits 1 when nothing is listening, which is the good case — swallow it, or set -e ends
	# the script here with no output at all.
	pid=$(lsof -nP -iTCP:"$1" -sTCP:LISTEN -t 2>/dev/null | head -1 || true)
	[ -n "$pid" ] || return 0

	# Name what is holding it, including the working directory — on a machine where every project
	# has its own dev env, the answer is usually another project, and "node" alone does not say
	# which. ~/Projects/LOCAL_PORTS.md is the registry these numbers come from.
	local comm cwd
	comm=$(ps -p "$pid" -o comm= 2>/dev/null | sed 's|.*/||')
	cwd=$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -1)

	fail "port $1 is held by pid $pid ($comm${cwd:+ in $cwd}) — $2"
}

check_port "$CLIENT_PORT" "stop it, or the client has nowhere to listen (strictPort)"
[ "$run_server" -eq 0 ] || check_port "$SERVER_PORT" "stop it, or pass --no-server to use it as-is"
[ "$inspect" -eq 0 ] || check_port "$INSPECT_PORT" "stop it, or drop --inspect"

# Rooms only. Ratings are deliberately left alone: the log is the history every rating is derived
# from, so dropping it is a much bigger thing than dropping a game in progress — `rm -rf .dev-ratings`
# says so out loud, and this flag should not do it quietly.
if [ "$clean" -eq 1 ] && [ -d "$STATE_DIR" ]; then
	note "dropping persisted rooms in $STATE_DIR/ (ratings in $RATINGS_DIR/ are kept)"
	rm -rf "$STATE_DIR"
fi

# --- process management ------------------------------------------------------------------------

# Invoked directly rather than through npx: `npm exec vite` leaves an npm process between this
# script and the one actually holding the port, and that middleman is what turns Ctrl-C into an
# orphaned server on the game-server port.
VITE=node_modules/.bin/vite
[ -x "$VITE" ] || fail "$VITE is missing — run \`npm install\`"

PIDS=""

start() {
	local label="$1" color="$2"
	shift 2
	local tag
	tag=$(printf '%s%7s%s %s│%s ' "$color" "$label" "$RESET" "$DIM" "$RESET")

	("$@" 2>&1 | awk -v tag="$tag" '{ print tag $0; fflush() }') &
	PIDS="$PIDS $!"
}

# Every pid under one of ours, deepest first. Killing a parent before its children orphans them
# onto the port they hold — `node --watch` and the awk pipeline both have a real worker below
# them. Collected before signalling anything, because once a parent dies its children reparent to
# init and pgrep can no longer find them, which would leave the follow-up KILL nothing to aim at.
#
# The obvious alternative — `set -m` and one kill per process group — does not hold: bash only
# assigns a background job its own group when it can, and a script launched without a controlling
# terminal silently gets none. Measured here: same script, one run isolated, one not.
collect_tree() {
	local child
	for child in $(pgrep -P "$1" 2>/dev/null); do
		collect_tree "$child"
	done
	echo "$1"
}

shutting_down=0

cleanup() {
	[ "$shutting_down" -eq 0 ] || return 0
	shutting_down=1

	# This runs on SIGPIPE too (`./dev.sh | head`), and stdout is then a closed pipe — so the very
	# first message below would re-raise SIGPIPE and kill the teardown half-done, leaving the rebuild
	# watcher alive. Ignoring the signal turns those writes into harmless failures, and set +e keeps
	# a failed write from aborting the function. We are exiting anyway.
	trap '' PIPE
	set +e

	printf '\n'
	note "stopping"

	local targets="" pid
	for pid in $PIDS; do
		targets="$targets $(collect_tree "$pid" | tr '\n' ' ')"
	done

	for pid in $targets; do
		kill -TERM "$pid" 2>/dev/null || true
	done

	sleep 1

	for pid in $targets; do
		kill -KILL "$pid" 2>/dev/null || true
	done

	# Ports are the thing that actually matters — say so rather than let the next run fail with a
	# confusing "already in use".
	local port held
	for port in "$CLIENT_PORT" "$SERVER_PORT"; do
		held=$(lsof -nP -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null | head -1 || true)
		[ -z "$held" ] || printf '%s!%s port %s is still held by pid %s\n' "$YELLOW" "$RESET" "$port" "$held" >&2
	done
}

# Ctrl-C exits from inside the handler rather than falling back into the watch loop below, which
# would otherwise notice the processes cleanup just killed and report them as having died on their
# own. cleanup is idempotent, so the EXIT trap that follows is a no-op.
#
# HUP and PIPE are here because without them the ports leak: closing the editor's terminal panel
# sends HUP, and piping this script into anything that exits first (`./dev.sh | head`) sends PIPE.
# An untrapped signal kills the script without running cleanup, and the server and vite survive it
# holding :3018 and :3017 — measured, not theoretical.
trap 'cleanup; exit 130' INT
trap 'cleanup; exit 143' TERM
trap 'cleanup; exit 129' HUP
trap 'cleanup; exit 141' PIPE
trap cleanup EXIT

wait_for_url() {
	local url="$1" name="$2" tries=0
	# -S would print a connection error for every poll before the service is up.
	until curl -fs -o /dev/null --max-time 2 "$url"; do
		tries=$((tries + 1))
		[ "$tries" -lt 60 ] || fail "$name never came up at $url"
		sleep 0.5
	done
}

# --- server ------------------------------------------------------------------------------------

if [ "$run_server" -eq 1 ]; then
	# The server is a bundle, not the source: src/game and src/domain are shared with the browser
	# and import each other through vite aliases, so something has to resolve them. Build once up
	# front, then keep rebuilding in the background while node --watch restarts on the result.
	#
	# Building here rather than leaving it to the watcher is what turns a broken server into one
	# clear message instead of a timeout. The cost is the single extra restart you see at startup:
	# the watcher's own first build rewrites the bundle, and node --watch notices. Nothing is
	# connected yet, so it costs nothing but a line of log.
	note "building the server bundle"
	"$VITE" build -c vite.server.config.mjs --logLevel warn >/dev/null ||
		fail "server build failed — run \`npm run build:server\` to see why"

	# Handed to the server process rather than exported: PORT is a name half the ecosystem reads,
	# and the client is started from this same shell. Unquoted on purpose — the split into separate
	# assignments is what `env` wants, and none of these values contain a space.
	SERVER_ENV="PORT=$SERVER_PORT HOST=127.0.0.1 HA_STATE_DIR=$STATE_DIR HA_RATINGS_DIR=$RATINGS_DIR HA_JOINS_PER_MINUTE=$JOINS_PER_MINUTE"

	if [ "$inspect" -eq 1 ]; then
		start server "$GREEN" env $SERVER_ENV node --watch --inspect="$INSPECT_PORT" dist-server/main.mjs
	else
		start server "$GREEN" env $SERVER_ENV node --watch dist-server/main.mjs
	fi

	start rebuild "$YELLOW" "$VITE" build -c vite.server.config.mjs --watch --logLevel warn

	wait_for_url "http://127.0.0.1:$SERVER_PORT/healthz" "the game server"
fi

# --- client ------------------------------------------------------------------------------------

if [ "$preview" -eq 1 ]; then
	# vite preview serves the committed docs/ build, which is also what the e2e suite drives — so
	# this is the mode to reproduce a spec failure in. Nothing rebuilds it while it runs.
	note "building docs/"
	"$VITE" build --logLevel warn >/dev/null || fail "client build failed — run \`npm run build\` to see why"
	start client "$BLUE" "$VITE" preview
else
	start client "$BLUE" "$VITE"
fi

wait_for_url "http://localhost:$CLIENT_PORT/" "the client"

# --- ready -------------------------------------------------------------------------------------

url="http://localhost:$CLIENT_PORT/"

printf '\n'
printf '%sdev env ready%s\n' "$BOLD$GREEN" "$RESET"
if [ "$preview" -eq 1 ]; then
	printf '  game        %s  %s(docs/ build, no HMR)%s\n' "$url" "$DIM" "$RESET"
else
	printf '  game        %s\n' "$url"
fi
printf '  flat board  %s?flat\n' "$url"
printf '  mid-game    %s?test=play\n' "$url"
if [ "$run_server" -eq 1 ]; then
	printf '  server      ws://127.0.0.1:%s  (proxied at %sws)\n' "$SERVER_PORT" "$url"
	printf '  rooms       %s/%s\n' "$(pwd)" "$STATE_DIR"
	[ "$inspect" -eq 0 ] || printf '  inspector   ws://127.0.0.1:%s\n' "$INSPECT_PORT"
else
	printf '  server      %snot started (--no-server)%s\n' "$DIM" "$RESET"
fi
printf '\n'
printf '%sOnline play: host a game in one tab, then open the #/r/CODE link it gives you in another.%s\n' "$DIM" "$RESET"
printf '%sCtrl-C stops everything.%s\n\n' "$DIM" "$RESET"

if [ "$open_browser" -eq 1 ]; then
	if command -v open >/dev/null 2>&1; then
		open "$url"
	elif command -v xdg-open >/dev/null 2>&1; then
		xdg-open "$url"
	fi
fi

# Not `wait`: that returns only once *everything* has died, so a vite that crashed on its own would
# leave a half dev env sitting there looking healthy. bash 3.2 (what macOS ships, and what the
# shebang resolves to here) has no `wait -n`, and an exited-but-unreaped child still answers
# `kill -0`, so the liveness check has to read the process state.
while :; do
	for pid in $PIDS; do
		case "$(ps -p "$pid" -o stat= 2>/dev/null)" in
			'' | Z*)
				printf '\n%s✗%s a process exited on its own — shutting the rest down\n' "$RED" "$RESET" >&2
				exit 1
				;;
		esac
	done

	sleep 1
done
