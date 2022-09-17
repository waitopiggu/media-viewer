module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  extends: ['airbnb'],
  globals: {
    document: true,
  },
  rules: {
    'func-names': 0,
    'import/no-named-as-default': 0,
    'import/no-named-as-default-member': 0,
    'no-console': 0,
    'no-unused-expressions': 0,
    'object-curly-newline': 0,
    'react/jsx-closing-bracket-location': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-props-no-spreading': 0,
    'react/prop-types': 0,
  },
};
