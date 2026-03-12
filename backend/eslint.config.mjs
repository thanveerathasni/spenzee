import js from "@eslint/js";
import parser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,

  {
    files: ["**/*.ts"],
    languageOptions: {
      parser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        Buffer: "readonly"
      }
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "off",

      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal"],
          alphabetize: { order: "asc" }
        }
      ]
    }
  },

  prettier
];