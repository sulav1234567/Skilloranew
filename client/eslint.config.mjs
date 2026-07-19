import unusedImports from "eslint-plugin-unused-imports";

export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
    ],
  },

  {
    files: ["**/*.{js,jsx,mjs,cjs}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    plugins: {
      "unused-imports": unusedImports,
    },

    rules: {
      // Disable ESLint's normal unused-variable rule.
      "no-unused-vars": "off",

      // Unused imports appear only as warnings, not red errors.
      "unused-imports/no-unused-imports": "warn",

      // Do not report unused normal variables.
      "unused-imports/no-unused-vars": "off",
    },
  },
];