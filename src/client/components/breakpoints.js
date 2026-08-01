// Both thresholds sit deliberately clear of 800x600, which is the viewport the browser specs
// are pinned to. Anything that reflows below these must leave the 800x600 layout untouched, or
// the suite starts failing on click positions rather than on behaviour.
export const NARROW = 780;
export const SHORT = 520;

// Phone held upright: the row of HQ / board / HQ has nowhere to go and must stack.
export const narrow = `@media (max-width: ${NARROW}px)`;

// Phone on its side: width is fine, height is not — the action bar was falling off the bottom.
export const short = `@media (max-height: ${SHORT}px)`;

export const narrowOrShort = `@media (max-width: ${NARROW}px), (max-height: ${SHORT}px)`;
