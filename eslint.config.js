import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config({
	extends: [
		js.configs.recommended,
		...tseslint.configs.recommended,
		stylistic.configs.customize({ indent: 'tab' })
	],
	files: ['**/*.{ts,tsx,js}'],
	ignores: ['dist'],
	languageOptions: {
		ecmaVersion: 2020,
		globals: globals.browser
	},
	plugins: {
		'react-hooks': reactHooks,
		'react-refresh': reactRefresh,
		'@stylistic': stylistic
	},
	rules: {
		...reactHooks.configs.recommended.rules,
		...stylistic.configs['recommended-flat'].rules,
		'@stylistic/indent': 'warn',
		'@stylistic/no-tabs': 'off',
		'@stylistic/comma-dangle': 'off',
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true }
		]
	}
})
