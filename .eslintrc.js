module.exports = {
  // extends: [require.resolve('@umijs/fabric/dist/eslint')],
  extends: ['react-app'],
  rules: {
    // eslint
    'no-unused-expressions': 0, // 禁止未使用的表达式
    'no-use-before-define': 'off',
    'comma-dangle': ['error', 'never'], // 禁止在对象和数组文字中使用尾随逗号
    'no-multiple-empty-lines': 'error', // 不允许多个空行
    'import/no-anonymous-default-export': [2, { allowArray: true }],
    // typescript
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-use-before-define': ['off', { variables: false }],
    // react
    'jsx-a11y/alt-text': 0,
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        "components": ["Link"],
        "specialLink": ["hrefLeft", "hrefRight"],
        "aspects": ["invalidHref"]
      }
    ],
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true
      }
    ], // jsx自闭合
    'react/jsx-closing-bracket-location': [1, 'line-aligned'],
    'react-hooks/exhaustive-deps': 'off',
    'react/jsx-key': ['error', { checkFragmentShorthand: true }] // jsx map key
  },
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true
  }
};
