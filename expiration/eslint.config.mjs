import globals from "globals";
import tseslint from "typescript-eslint";
import airbnbBase from "eslint-config-airbnb-base";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import tsParser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ["node_modules", "dist/", "build/"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: {
      prettier: prettierPlugin,
    },
    extends: ["airbnb-base", "prettier"],
    rules: {
      ...(airbnbBase.rules || {}),
      "import/extensions": "off", // Allow importing without file extensions
      "import/no-unresolved": "error",
      "no-console": "warn", // Warn instead of error on console logs
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "prettier/prettier": "error", // Ensure Prettier is enforced
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
    extends: ["plugin:@typescript-eslint/recommended", "airbnb-base"],
  },
  { languageOptions: { globals: { ...globals.node } } },
  prettierConfig,
];
