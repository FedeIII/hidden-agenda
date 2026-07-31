# Deploying hidden-agenda.azyr.io

Two Node processes are not involved: **nginx serves the static bundle straight off disk** and proxies only `/ws` and `/healthz` to one small Node process.

Everything is prebuilt and committed — `docs/` (browser) and `dist-server/main.mjs` (server) — so the box installs exactly one package (`ws`) and never runs a build. That matters because **the box is on Node 18.19** while the toolchain needs Node 22; `vite.server.config.mjs` targets `node18` on purpose.

## Box facts (checked)

| | |
| --- | --- |
| Node on the box | 18.19.1, PM2 runs apps with the same one |
| Port 3007 | free |
| TLS | `/etc/nginx/ssl/azyr.io.pem` already covers `*.azyr.io` — no new certificate |
| mTLS | **not** used here. Only `osler.azyr.io` has Authenticated Origin Pulls |

## One-time setup

Steps 1 and 2 are not doable from the box.

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

If PM2 will not run the `.mjs` entry point, that is the one thing here that has not been verified on this box — `node dist-server/main.mjs` from the same directory is the fallback check.

**6. nginx:**

```bash
cp /opt/hidden-agenda/deploy/nginx/hidden-agenda.azyr.io.conf \
   /etc/nginx/sites-available/hidden-agenda.azyr.io
ln -s /etc/nginx/sites-available/hidden-agenda.azyr.io /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

**7. Verify the real-IP config.** The server rate-limits room joins per IP. Check that `cloudflare-realip.conf` is in the **http** context (`/etc/nginx/conf.d/`) so `$remote_addr` is the visitor rather than a Cloudflare edge:

```bash
nginx -T | grep -c 'set_real_ip_from'
```

If it is absent, every visitor shares one rate-limit bucket and the 10-joins-per-minute limit will throttle real players. Fix the http-context config rather than raising the limit.

## Smoke tests

```bash
# the node process
curl -s http://127.0.0.1:3007/healthz

# nginx, bypassing Cloudflare. Works here, unlike osler, because there is no mTLS
curl -sk https://127.0.0.1/ -H 'Host: hidden-agenda.azyr.io' | head -5
curl -sk https://127.0.0.1/healthz -H 'Host: hidden-agenda.azyr.io'

# through Cloudflare
curl -s https://hidden-agenda.azyr.io/healthz
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

## Cache trap, deliberately handled

That box serves `*.js` with `Cache-Control: immutable` for a year on the main site. Assets here are **content-hashed**, so `/assets/` is pinned hard on purpose and `index.html` is `no-store` — it is the file that points at the current hashed bundle. Never add a fixed-filename script, and never cache `index.html`.
