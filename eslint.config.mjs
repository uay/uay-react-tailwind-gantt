import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: [
      "build/",
      "dist/",
      "node_modules/",
      ".snapshots/",
      "*.min.js",
      "*.css",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx"], // Apply to TypeScript files
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          legacyDecorators: true,
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    settings: {
      react: {
        version: "16",
      },
    },
    rules: {
      "space-before-function-paren": "off",
      "react/prop-types": "off",
      "react/jsx-handler-names": "off",
      "react/jsx-fragments": "off",
      "react/no-unused-prop-types": "off",
      "import/export": "off",
      "no-unused-vars": "off",
      "no-use-before-define": "off",
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
];
