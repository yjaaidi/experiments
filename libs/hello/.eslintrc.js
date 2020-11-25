module.exports = {
  extends: [
    '../../.eslintrc.json',
    'plugin:vue/essential',
    '@vue/typescript/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  ignorePatterns: ['!**/*'],
  rules: {},
  env: {
    node: true,
  },
  overrides: [
    {
      files: ['**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
};
