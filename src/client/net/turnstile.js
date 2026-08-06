// Public by design — a Turnstile site key is meant to be embedded in client-side markup, unlike its
// secret counterpart, which lives only in the server's environment (see server/turnstile.js).
export const TURNSTILE_SITE_KEY = '0x4AAAAAAEH6zeWi0hWGU40M';

// Cloudflare's own analytics tag for this integration. Passed as the `action` render option, the
// exact equivalent of a `data-action` attribute on an implicitly-rendered widget — this one is
// rendered explicitly, so there is no such div to tag.
export const TURNSTILE_ACTION = 'turnstile-spin-v2';
