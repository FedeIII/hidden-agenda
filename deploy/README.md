# Deploying hidden-agenda.azyr.io

Two Node processes are not involved: **nginx serves the static bundle straight off disk** and proxies only `/ws` and `/healthz` to one small Node process.

Everything is prebuilt and committed — `docs/` (browser) and `dist-server/main.mjs` (server) — so the box installs exactly one package (`ws`) and never runs a build. That matters because **the box is on Node 18.19** while the toolchain needs Node 22; `vite.server.config.mjs` targets `node18` on purpose.

## Box facts (checked)

| | |
| --- | --- |
| Node on the box | 18.19.1, PM2 runs apps with the same one |
| Port 3007 | free (3000–3006, 8410/8411 osler, 8420/8421 wallet are taken) |
| TLS | `/etc/nginx/ssl/azyr.io.pem` already covers `*.azyr.io` — no new certificate |
| Real visitor IPs | inherited from the http context, nothing to add — see step 7 |
| PM2 + `.mjs` | works, no wrapper needed |
| `/var/lib` writable | yes, `persistence: true` |
| Inherited caching | none; the apex's `immutable` rule is server-scoped |
| mTLS | **on**, matching osler and wallet |

## Cloudflare Authenticated Origin Pulls — on

Matching `osler.azyr.io` and `wallet.azyr.io`; only the apex does not use it. Only Cloudflare can reach this origin, so nobody who finds the IP can bypass Cloudflare's rate limiting and DDoS protection.

Follows the house pattern: `deploy/nginx/hidden-agenda-mtls.conf` holds the two directives and is installed to `/etc/nginx/snippets/`. The site config includes it **by glob**, so an absent file is not an error and moving the file aside then reloading is the rollback, with no config edit.

**This changes what healthy looks like from the box.** `curl -k https://127.0.0.1/ -H 'Host: hidden-agenda.azyr.io'` now returns **400 — "No required SSL certificate was sent"**. That is the stack correctly refusing a non-Cloudflare client, not a fault. Smoke-test the loopback upstream and the public URL instead.

## Status: deployed

The box side is **done and verified** — clone, `npm ci --omit=dev`, state dirs, PM2 (saved, and `pm2-root` is enabled so it survives a reboot), nginx installed, tested and reloaded. Every existing site was re-checked after the reload and is unaffected.

Verified on the box rather than assumed:

- Node 18.19 runs the bundle, and **PM2 6.0.13 runs an `.mjs` entry point** — the one item that had no local equivalent.
- `/var/lib/hidden-agenda/rooms` is writable: `/healthz` reports `persistence: true`. `/healthz` also reports `ratings: { enabled, players, events }`, which is how to tell from outside whether a result can actually be recorded — a state directory that is not writable is silent by design.
- A websocket upgrades **through nginx over TLS**, creates a room and writes it to disk.
- `index.html` is `no-store`, `/assets/` is a single `public, max-age=31536000, immutable`.

**It is live at https://hidden-agenda.azyr.io** — proxied Cloudflare `A` record, WebSockets on for the zone, mTLS enforced. Verified end to end from outside: two clients through Cloudflare join one room, each sees only its own alignment, and an out-of-turn action is refused.

## One-time setup

Kept as the record of what was done, and for rebuilding from scratch. Steps 1 and 2 are not doable from the box.

**1. Cloudflare DNS.** Add a **proxied** `A` record for `hidden-agenda` pointing at the VPS.

**2. Cloudflare WebSockets.** Confirm WebSockets are enabled for the zone (Network settings). Without it `/ws` fails while the page loads fine — a confusing failure worth ruling out first.

**3. Clone, matching `/opt/journal` and `/opt/house-md`:**

```bash
git clone https://github.com/FedeIII/hidden-agenda.git /opt/hidden-agenda
cd /opt/hidden-agenda
npm ci --omit=dev          # installs ws, nothing else
```

**4. Room state, ratings and log directories.** Games survive a deploy restart by being written here. If a path is not writable the server logs it and carries on in memory only, so this is a nice-to-have rather than a blocker.

```bash
mkdir -p /var/lib/hidden-agenda/rooms /var/lib/hidden-agenda/ratings /var/log/hidden-agenda
# owned by whatever user PM2 runs as (root, on this box)
```

**`ratings/` is a sibling of `rooms/`, and must never be inside it.** `persistence.loadAll()` reads *every* `*.json` in the rooms directory and hands each one to the room store, so a single foreign file there throws inside its outer `try`, the catch returns an empty list, and **every game in progress is silently dropped on the next restart**. Both paths are set explicitly in `deploy/pm2/ecosystem.config.cjs`.

Unlike `rooms/`, this directory is not disposable: `ratings/games.jsonl` is the append-only log every player's rating is derived from, and deleting it resets the ladder. It is the one piece of state on this box worth backing up — a plain file, so `cp` or `rsync` is the whole procedure.

**5. Start under PM2 and persist:**

```bash
cd /opt/hidden-agenda
pm2 start deploy/pm2/ecosystem.config.cjs
pm2 save
curl -s http://127.0.0.1:3007/healthz    # {"ok":true,...}
```

PM2 6.0.13 runs the `.mjs` entry fine — confirmed on this box, no wrapper needed.

The `/ws` block already sets `proxy_read_timeout 3600s`. nginx's 60s default would drop idle websockets, and Cloudflare has its own ~100s idle limit on top, which the server's 25s ping stays under.

**6. nginx:**

```bash
cp /opt/hidden-agenda/deploy/nginx/hidden-agenda.azyr.io.conf \
   /etc/nginx/sites-available/hidden-agenda.azyr.io
ln -s /etc/nginx/sites-available/hidden-agenda.azyr.io /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

**7. Real-IP restoration — already handled, do not touch.** Checked on the box: `/etc/nginx/conf.d/cloudflare-realip.conf` holds 22 `set_real_ip_from` ranges plus `real_ip_header CF-Connecting-IP`, and `conf.d/*` is included from the http context, so **this site inherits real visitor IPs for free**. That matters because the server rate-limits room joins per IP; without it every visitor would share one bucket.

**Do not copy that snippet into this site's server block.** `real_ip_header` is single-value, so a second copy is a hard `[emerg] directive is duplicate` and nginx will not start. Two existing configs carry warning comments about exactly this.

## Turnstile bot check

Room creation, joining and automatch are gated on a Cloudflare Turnstile solve — best-effort, the
same shape as persistence and ratings: with no secret in place, `server/turnstile.js` logs that the
check is disabled and lets every request through unchecked, rather than refusing everything a client
cannot possibly satisfy.

**The secret lives in `/opt/hidden-agenda/.env` on the box, and nowhere else** — gitignored, never
committed, never known to `ecosystem.config.cjs`. One-time setup:

```bash
# from the laptop, using the same key deploy-remote.sh does
scp -i ~/.ssh/id_rsa .env root@100.82.16.46:/opt/hidden-agenda/.env
ssh -i ~/.ssh/id_rsa root@100.82.16.46 'chmod 600 /opt/hidden-agenda/.env'
```

`ecosystem.config.cjs` sets `node_args: '--env-file-if-exists=.env'`, so **node itself** reads that
file fresh at every process start — this is what makes it survive an ordinary `pm2 reload`/restart/
reboot with no further action, unlike forwarding the value through PM2's own `env` block (which
depends on `--update-env` re-reading whatever shell issued the `pm2` command, not the file on disk;
tried first, replaced for exactly that fragility). `-if-exists` rather than `--env-file`: a box, or a
developer's machine, with no such file starts exactly as it did before this existed.

**This does need node ≥ 20.12** for the flag itself — true of the box's actual node (24.19 as of
2026-08-05, see "Open, and not blocking" below) but not of `vite.server.config.mjs`'s `node18`
build target, which only constrains what syntax the *bundle* may use, not what runs it.

Because `ecosystem.config.cjs` changed shape (`node_args` is new), the config has to be re-parsed by
PM2 at least once for it to take — `pm2 reload <name>` alone does not do this, only reloading by the
file itself does. `scripts/deploy-remote.sh` now reloads via `deploy/pm2/ecosystem.config.cjs` (not
`hidden-agenda`) and calls `pm2 save` afterwards for exactly this reason, so every future deploy
re-applies the file on disk and a reboot resurrects the same config rather than an older saved one.

The site key is public and lives in the client bundle (`src/client/net/turnstile.js`); only the
secret is server-side state, and only ever on the box.

## Smoke tests

```bash
# the node process, on the box
curl -s http://127.0.0.1:3007/healthz

# through Cloudflare — the real path
curl -s https://hidden-agenda.azyr.io/healthz
curl -sI https://hidden-agenda.azyr.io/ | grep -i cache-control     # must be no-store

# mTLS is doing its job when this is refused
curl -sk --resolve hidden-agenda.azyr.io:443:46.224.16.48 https://hidden-agenda.azyr.io/
```

Then the only test that really counts: open the site on two devices, one of them a phone, create a room on one, join with the code on the other, and play a turn each. Check that the second device cannot move a piece on the first device's turn.

## Deploying a change

From the laptop, never from the box:

```bash
./scripts/deploy-remote.sh
```

It builds, refuses to continue if the build changed committed artifacts or the tree is dirty or `HEAD` is not pushed, then pulls, `npm ci --omit=dev`, `pm2 reload`, and waits for `/healthz`. There is no webhook on this box: a `git push` alone ships nothing.

## Rolling back

The artifacts are committed, so a rollback is a checkout:

```bash
cd /opt/hidden-agenda
git log --oneline -5
git checkout <previous-commit> -- docs dist-server
pm2 reload hidden-agenda
```

Rooms in progress survive it — they are reloaded from `/var/lib/hidden-agenda/rooms` — but a client on the old bundle will keep talking to the new server, so prefer rolling back at a quiet moment.

## Open, and not blocking

Both of these outlived the plan that recorded them, and both are the box's business rather than this
repo's:

- ~~**The box runs Node 18.19, EOL since April 2025.**~~ **It is on Node 24.19 / npm 11.17 as of
  2026-08-05** — upgraded on the box, not by a deploy. `target: 'node18'` in `vite.server.config.mjs`
  still costs nothing and still should not be raised speculatively; the bundle runs fine either way.
  The upgrade did break one thing, below.
- **Rotate the Cloudflare API token** used to create the DNS record. It was pasted into a chat
  transcript, which is not where API tokens should live.

## The lockfile has to list every platform

`npm ci --omit=dev` on the box validates the whole lockfile, devDependency binaries included, even
though it installs one package. **npm 10 prunes optional platform binaries down to the machine that
ran the install; npm 11 requires them all.** So a `package-lock.json` written by npm 10 on a Mac lists
`lightningcss-darwin-arm64` and `@rolldown/binding-darwin-arm64` and nothing else, and the box — now
on npm 11 — refuses it:

```
npm error `npm ci` can only install packages when your package.json and package-lock.json ... are in sync
npm error Missing: lightningcss-linux-x64-gnu@1.33.0 from lock file
```

The deploy fails **after** `git pull` and before `pm2 reload`, so the box ends up with new source and
the old process still running. Nothing is broken, and re-deploying once the lockfile is fixed picks it
up — but the health check the script prints is the *old* build passing.

The fix, and the trap: regenerate with npm 11 rather than hand-editing.

```bash
npx --yes npm@11 install --package-lock-only
```

That adds the 23 platform binaries and changes no resolved version. It also drops `@types/node`, an
*optional peer* of vite that npm 11 does not install and nothing here consumes — `tsconfig.json` is
`noEmit` and exists only for Playwright's path resolution.

**Any `npm install` run by npm 10 prunes them straight back out**, and the next deploy fails the same
way. Verify before deploying, from anywhere:

```bash
npx --yes npm@11 ci --omit=dev --dry-run   # must print "add ws" and nothing else
```

The durable answer is to run the same npm as the box (node 24 brings npm 11); `.nvmrc` says >= 22.12,
which node 22 satisfies with npm 10.

## Cache trap, deliberately handled

The apex `azyr.io` site serves `*.js` with `expires 1y; Cache-Control: immutable`, but that rule is **server-scoped, so this site inherits nothing** — checked on the box. This site therefore sets its own. Assets here are **content-hashed**, so `/assets/` is pinned hard on purpose and `index.html` is `no-store` — it is the file that points at the current hashed bundle. Never add a fixed-filename script, and never cache `index.html`.
