import { config as nodeConfig } from "./packages/eslint-config/node.js";

/** @type {import("eslint").Linter.Config[]} */

export default [
    ...nodeConfig.map((cfg) => ({
        ...cfg,
        files: ["apps/backend/src/**/*.{ts,tsx}"],
    })),
    {
        ignores: [
            "**/node_modules",
            "**/.turbo",
            "**/generated",
            "**/dist",
            "**/.next",
            "**/migrations",
        ],
    },
];
