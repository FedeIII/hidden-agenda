import { useCallback, useEffect, useRef, useState } from 'react';
import { TURNSTILE_SITE_KEY, TURNSTILE_ACTION } from 'Client/net/turnstile';

// Cloudflare's script tag lives in index.html and loads async, so `window.turnstile` is not there
// yet on the first render — this polls for it rather than assuming it has already arrived.
const POLL_MS = 100;

// Renders a Turnstile widget into whatever element `containerRef` is attached to, and hands back
// the token once the visitor has solved it. Explicit rendering rather than a `cf-turnstile` div
// Cloudflare's script auto-scans for: this needs the token as a value (to send over the socket),
// needs to not render at all when the bot check is disabled, and needs to be resettable, none of
// which the implicit method offers.
export function useTurnstile(enabled) {
	const containerRef = useRef(null);
	const widgetId = useRef(null);
	const [token, setToken] = useState(null);

	useEffect(() => {
		if (!enabled || !containerRef.current) {
			return undefined;
		}

		let cancelled = false;
		let poll = null;

		function render() {
			if (cancelled || !window.turnstile || !containerRef.current) {
				return;
			}

			widgetId.current = window.turnstile.render(containerRef.current, {
				sitekey: TURNSTILE_SITE_KEY,
				action: TURNSTILE_ACTION,
				callback: setToken,
				'error-callback': () => setToken(null),
				'expired-callback': () => setToken(null),
			});
		}

		if (window.turnstile) {
			render();
		} else {
			poll = setInterval(() => {
				if (window.turnstile) {
					clearInterval(poll);
					render();
				}
			}, POLL_MS);
		}

		return () => {
			cancelled = true;

			if (poll) {
				clearInterval(poll);
			}

			if (widgetId.current && window.turnstile) {
				window.turnstile.remove(widgetId.current);
				widgetId.current = null;
			}
		};
	}, [enabled]);

	// A token is single-use: the server rejecting a request that was sent with one means it has
	// already been redeemed at Cloudflare's edge, valid or not, and resending it fails as
	// `timeout-or-duplicate` rather than as whatever the request itself was refused for.
	//
	// Memoized with no dependencies — it only ever reads refs — so a caller can put it in an
	// effect's dependency list without that effect re-firing on every render.
	const reset = useCallback(() => {
		setToken(null);

		if (widgetId.current && window.turnstile) {
			window.turnstile.reset(widgetId.current);
		}
	}, []);

	return { containerRef, token, reset };
}

export default useTurnstile;
