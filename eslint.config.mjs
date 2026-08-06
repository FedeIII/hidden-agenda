import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';

// Prettier owns formatting, so there are no stylistic rules here on purpose.
export default [
	{
		ignores: ['docs/**', 'node_modules/**', 'test-results/**', 'playwright-report/**', 'blob-report/**'],
	},

	js.configs.recommended,
	// The flat variants are nested under .flat; the top-level ones are still eslintrc-shaped
	// and eslint 10 rejects them.
	reactHooks.configs.flat['recommended-latest'],

	{
		files: ['**/*.{js,jsx,mjs,cjs}'],
		languageOptions: {
			ecmaVersion: 2023,
			sourceType: 'module',
			parserOptions: { ecmaFeatures: { jsx: true } },
			globals: { ...globals.browser, ...globals.node },
		},
		rules: {
			// `const [_state, dispatch] = useContext(...)` is a deliberate idiom here.
			'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
		},
	},

	{
		files: ['src/tests/**'],
		rules: {
			// A spec's destructured parameters are how it declares which playwright fixtures to
			// set up. They are a dependency list, not a usage, so "unused" says nothing here.
			'no-unused-vars': ['error', { args: 'none', varsIgnorePattern: '^_' }],

			// There is no React in the specs. The rule fires because playwright names a fixture's
			// callback `use`, and it reads that as React's use() hook.
			'react-hooks/rules-of-hooks': 'off',
		},
	},
];
