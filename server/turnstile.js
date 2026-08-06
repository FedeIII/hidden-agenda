const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// Bot check for online room creation, joining and automatch. Best-effort like persistence and
// ratings: with no secret configured — locally without a .env, or the test server, which
// deliberately does not set one — the check is disabled and logged rather than refusing every
// request a client cannot possibly satisfy.
export function createTurnstileGuard({
	secret = process.env.TURNSTILE_SECRET,
	log = console.log,
	fetchImpl = fetch,
} = {}) {
	const enabled = Boolean(secret);

	if (!enabled) {
		log('TURNSTILE_SECRET not set — bot check disabled for room creation/joining');
	}

	async function verify(token, ip) {
		if (typeof token !== 'string' || !token) {
			return false;
		}

		try {
			const response = await fetchImpl(SITEVERIFY_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams({
					secret,
					response: token,
					...(ip && ip !== 'unknown' ? { remoteip: ip } : {}),
				}),
			});

			if (!response.ok) {
				return false;
			}

			const result = await response.json();

			return result.success === true;
		} catch (error) {
			// Network error, non-2xx already handled above, or a body that is not JSON. Fail
			// closed: a bot check that cannot be confirmed is not a bot check.
			log(`turnstile siteverify failed: ${error.stack || error.message}`);

			return false;
		}
	}

	return { enabled, verify };
}

export default createTurnstileGuard;
