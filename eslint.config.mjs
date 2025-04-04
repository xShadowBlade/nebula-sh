// @ts-check

/**
 * @file ESLint configuration file
 */
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import jsdoc from "eslint-plugin-jsdoc";

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    jsdoc.configs["flat/recommended-typescript"],
    eslintPluginPrettierRecommended,

    {
        plugins: {
            jsdoc,
        },
        languageOptions: {
            parserOptions: {
                project: "./tsconfig.eslint.json",
                sourceType: "module",
                ecmaVersion: "latest",
            },
        },
        files: ["src/**/*.ts", "src/**/*.tsx", "test/xterm/**/*.ts", "test/**/*.ts"],
        ignores: ["node_modules", "test/xterm/node_modules", "test/node_modules", "dist", "test/build/"],
        rules: {
            "prettier/prettier": "warn",

            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/ban-ts-comment": "warn",
            "@typescript-eslint/explicit-function-return-type": "warn",
            "@typescript-eslint/restrict-template-expressions": ["warn", { allowNumber: true, allowBoolean: true }],
            "@typescript-eslint/consistent-type-exports": "warn",
            "@typescript-eslint/consistent-type-imports": "warn",
            "@typescript-eslint/naming-convention": [
                "warn",
                {
                    selector: "enumMember",
                    format: ["PascalCase"],
                },
            ],

            "jsdoc/require-file-overview": 1,
        },
    },
);
