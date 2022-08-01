module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import', 'jest'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],
    '@typescript-eslint/ban-types': 'off',
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.test.ts'],
      extends: ['plugin:jest/recommended'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-empty-function': 'off',
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'warn',
        'jest/no-identical-title': 'warn',
        'jest/valid-expect': 'warn',
      },
    },
  ],
};
