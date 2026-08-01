#!/usr/bin/env bash
#
# Deploy hidden-agenda to the VPS, from the laptop.
#
# There is no webhook on that box: a git push ships nothing by itself. This script is the deploy.
# It builds locally (the box has no toolchain and only node 18), refuses to ship anything that is
# not committed and pushed, then pulls and reloads over ssh.
#
#   ./scripts/deploy-remote.sh
#
# One-time setup is in deploy/README.md and has to be done first.

set -euo pipefail

# The tailnet address, not the public IP: port 22 is not reachable from the internet on that box.
HOST="${HA_DEPLOY_HOST:-root@100.82.16.46}"
REMOTE_DIR="${HA_DEPLOY_DIR:-/opt/hidden-agenda}"
SSH_KEY="${HA_SSH_KEY:-$HOME/.ssh/id_rsa}"
BRANCH="${HA_DEPLOY_BRANCH:-master}"

say() { printf '\n\033[1m==> %s\033[0m\n' "$1"; }
die() { printf '\n\033[31merror: %s\033[0m\n' "$1" >&2; exit 1; }

cd "$(dirname "$0")/.."

say "Building both bundles"
npm run build:all

# The artifacts are committed, so a dirty tree here means the box would get older code than the
# one just tested. Fail rather than ship a surprise.
if [[ -n "$(git status --porcelain docs dist-server)" ]]; then
	git status --short docs dist-server
	die "the build changed committed artifacts — commit them, then deploy"
fi

if [[ -n "$(git status --porcelain)" ]]; then
	git status --short
	die "working tree is dirty — commit or stash first"
fi

say "Checking the local commit is pushed"
git fetch --quiet origin "$BRANCH"
if [[ "$(git rev-parse HEAD)" != "$(git rev-parse "origin/$BRANCH")" ]]; then
	die "HEAD differs from origin/$BRANCH — push first, the box deploys by pulling"
fi

say "Deploying to $HOST:$REMOTE_DIR"
ssh -i "$SSH_KEY" "$HOST" bash -euo pipefail <<REMOTE
cd "$REMOTE_DIR"

echo "--> pulling"
git pull --ff-only origin $BRANCH

echo "--> installing runtime dependencies (ws only)"
npm ci --omit=dev

echo "--> reloading"
pm2 reload hidden-agenda --update-env

echo "--> waiting for health"
for attempt in \$(seq 1 20); do
	if curl -fsS http://127.0.0.1:3007/healthz > /tmp/ha-health.json; then
		cat /tmp/ha-health.json
		echo
		exit 0
	fi
	sleep 0.5
done

echo "health check never passed; recent logs:" >&2
pm2 logs hidden-agenda --lines 40 --nostream >&2
exit 1
REMOTE

say "Deployed. Checking it through Cloudflare"
curl -fsS "https://hidden-agenda.azyr.io/healthz" && echo || die "the origin is healthy but the public URL is not — check DNS and the nginx site"

say "Done"
