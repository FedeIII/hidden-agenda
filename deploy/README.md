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
- `/var/lib/hidden-agenda/rooms` is writable: `/healthz` reports `persistence: true`.
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

**4. Room state and log directories.** Games survive a deploy restart by being written here. If the path is not writable the server logs it and carries on in memory only, so this is a nice-to-have rather than a blocker.

```bash
mkdir -p /var/lib/hidden-agenda/rooms /var/log/hidden-agenda
# owned by whatever user PM2 runs as (root, on this box)
```

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

- **The box runs Node 18.19, EOL since April 2025.** This app targets `node18` deliberately so it does
  not force the question, but the other five PM2 apps share that runtime. Do not raise
  `target: 'node18'` in `vite.server.config.mjs` speculatively — there is a comment there saying so.
- **Rotate the Cloudflare API token** used to create the DNS record. It was pasted into a chat
  transcript, which is not where API tokens should live.

## Cache trap, deliberately handled

The apex `azyr.io` site serves `*.js` with `expires 1y; Cache-Control: immutable`, but that rule is **server-scoped, so this site inherits nothing** — checked on the box. This site therefore sets its own. Assets here are **content-hashed**, so `/assets/` is pinned hard on purpose and `index.html` is `no-store` — it is the file that points at the current hashed bundle. Never add a fixed-filename script, and never cache `index.html`.
