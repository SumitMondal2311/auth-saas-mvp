import globals from "globals";
import path from "path";
import { config as baseConfig } from "./base.js";

/** @type {import("eslint").Linter.Config[]} */

export const config = [
    ...baseConfig,
    {
        languageOptions: {
            parserOptions: {
                project: ["apps/backend/tsconfig.json", "packages/database/tsconfig.json"],
                tsconfigRootDir: path.resolve(import.meta.dirname, "../.."),
            },
            globals: {
                ...globals.node,
            },
        },
    },
];
