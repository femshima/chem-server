module.exports = {
  "env": {
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "tsconfigRootDir": __dirname,
    "project": "./tsconfig.json",
    "sourceType": "module"
  },
  "rules": {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "varsIgnorePattern": "^_",
        "argsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/explicit-function-return-type": ["error"],
    "@typescript-eslint/explicit-member-accessibility": ["error"],
    "@typescript-eslint/method-signature-style": ["error", "method"],
    "@typescript-eslint/naming-convention": [
      "warn",
      { "selector": "default", "format": ["camelCase"] },
      { "selector": "typeLike", "format": ["PascalCase"] },
      {
        "selector": "variable",
        "modifiers": ["const", "global"],
        "format": ["camelCase", "UPPER_CASE"]
      }
    ],
    "@typescript-eslint/prefer-readonly": ["warn"],
    "@typescript-eslint/promise-function-async": ["error"],
    "@typescript-eslint/sort-type-union-intersection-members": ["error"],
    "@typescript-eslint/switch-exhaustiveness-check": ["error"]
  }
}
