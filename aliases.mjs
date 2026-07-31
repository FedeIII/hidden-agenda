import path from 'node:path';

// One alias map, imported by both vite configs. tsconfig.json repeats it for playwright's
// resolver, which cannot read this file — those two are the pair to keep in step.
const fromRoot = target => path.resolve(process.cwd(), target);

export const aliases = {
	Src: fromRoot('src'),
	Client: fromRoot('src/client'),
	Components: fromRoot('src/client/components'),
	Phases: fromRoot('src/client/phases'),
	State: fromRoot('src/client/state'),
	Hooks: fromRoot('src/client/hooks'),
	Domain: fromRoot('src/domain'),
	Game: fromRoot('src/game'),
	Server: fromRoot('server'),
};

export default aliases;
