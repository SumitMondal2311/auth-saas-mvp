import pluginNext from "@next/eslint-plugin-next";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import path from "path";
import { config as baseConfig } from "./base.js";

/** @type {import("eslint").Linter.Config[]} */

export const config = [
    {
        plugins: {
            "react-hooks": pluginReactHooks,
        },
        rules: {
            ...pluginReactHooks.configs.recommended.rules,
        },
    },
    {
        plugins: {
            react: pluginReact,
        },
        rules: {
            ...pluginReact.configs.recommended.rules,
            "react/react-in-jsx-scope": "off",
            "react/no-unescaped-entities": "off",
        },
    },
    {
        plugins: {
            "@next/next": pluginNext,
        },
        rules: {
            ...pluginNext.configs.recommended.rules,
            ...pluginNext.configs["core-web-vitals"].rules,
            "next/no-html-link-for-pages": "off",
            "@next/next/no-html-link-for-pages": "off",
        },
    },
    ...baseConfig,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },
            parserOptions: {
                tsconfigRootDir: path.resolve(import.meta.dirname, "../.."),
                project: ["apps/frontend/tsconfig.json"],
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
];
