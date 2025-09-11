import { config as nextConfig } from "./packages/eslint-config/next.js";
import { config as nodeConfig } from "./packages/eslint-config/node.js";

/** @type {import("eslint").Linter.Config[]} */

export default [
    ...nodeConfig.map((cfg) => ({
        ...cfg,
        files: ["apps/backend/src/**/*.ts", "packages/database/src/**/*.ts"],
    })),
    ...nextConfig.map((cfg) => ({
        ...cfg,
        files: ["apps/frontend/**/*.{ts,tsx}"],
    })),
    {
        ignores: [
            "**/node_modules",
            "**/.turbo",
            "**/dist",
            "**/generated",
            "**/.next",
            "**/next-env.d.ts",
            "**/migrations",
        ],
    },
];
