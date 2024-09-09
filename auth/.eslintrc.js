module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    extends: [
        "airbnb-base",
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended', // Uses eslint-config-prettier to disable ESLint rules that would conflict with prettier
        'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    ],
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
    },
    plugins: ["@typescript-eslint", "prettier"],
    rules: {
        // list of compat rules:
        // these rule exceptions has been added for compatibility with the current state of the codebase.
        // little by little these rules should be negated and codes related to this rule needs to change/refactored.
        // but for the scope of what we're doing here we can't afford refactor on 30+ project in 1 week.

    },
};
