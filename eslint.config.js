import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import tanstackQuery from '@tanstack/eslint-plugin-query'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config({
	extends: [
		js.configs.recommended,
		...tseslint.configs.strictTypeChecked,
		...tanstackQuery.configs['flat/recommended']
	],
	settings: {
		react: {
			version: '18.3'
		}
	},
	files: ['**/*.{ts,tsx}'],
	ignores: ['dist'],
	languageOptions: {
		ecmaVersion: 2020,
		globals: globals.browser,
		parserOptions: {
			project: ['./tsconfig.node.json', './tsconfig.app.json'],
			tsconfigRootDir: import.meta.dirname
		}
	},
	plugins: {
		'react-hooks': reactHooks,
		'react-refresh': reactRefresh,
		'@stylistic': stylistic,
		react
	},
	rules: {
		...reactHooks.configs.recommended.rules,
		...stylistic.configs['recommended-flat'].rules,
		'@stylistic/indent': ['warn', 'tab'],
		'@stylistic/no-tabs': 'off',
		'@stylistic/comma-dangle': ['warn', 'never'],
		'@stylistic/quotes': ['warn', 'single'],
		'@stylistic/jsx-quotes': ['warn', 'prefer-single'],
		'@stylistic/arrow-parens': ['warn', 'as-needed'],
		'@stylistic/jsx-indent-props': 'off',
		...react.configs.recommended.rules,
		...react.configs['jsx-runtime'].rules,
		'@typescript-eslint/consistent-type-imports': ['warn', { fixStyle: 'inline-type-imports' }],
		'@typescript-eslint/no-unused-vars': ['warn', {
			vars: 'all',
			args: 'after-used',
			argsIgnorePattern: '^_'
		}],
		'react/self-closing-comp': [
			'warn',
			{
				component: true,
				html: true
			}
		],
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true }
		]
	}
})
