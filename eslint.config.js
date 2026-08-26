export default [
  {
    ignores: ['lib/**', 'coverage/**', 'node_modules/**'],
  },
  {
    files: ['src/**/*.js', 'scripts/**/*.mjs', 'tests/**/*.js', 'tests/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
    },
    rules: {
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-debugger': 'error',
    },
  },
]
