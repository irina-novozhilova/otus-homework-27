module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: [
    "airbnb-base",
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["jest", "@typescript-eslint"],
  rules: {
    "import/prefer-default-export": "off",
    "import/no-unresolved": "off",
    "import/extensions": ["warn", "never"],
    "max-len": "off",
    "no-console": ["error", { allow: ["warn", "error", "log"] }],
    "no-alert": "off",
    "no-promise-executor-return": "off",
    "prefer-destructuring": ["error", { object: true, array: false }],
    "class-methods-use-this": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
  root: true,
  globals: {
    ymaps: "writable",
    yandexMap: "writable",
  },
};
