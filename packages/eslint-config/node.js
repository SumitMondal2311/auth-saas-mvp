import globals from "globals";
import { config as baseConfig } from "./base.js";

/** @type {import("eslint").Linter.Config[]} */

export const config = [
    ...baseConfig,
    {
        languageOptions: {
            parserOptions: {
                project: ["apps/backend/tsconfig.json"],
            },
            globals: {
                ...globals.node,
            },
        },
    },
];
