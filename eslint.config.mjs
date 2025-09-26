import { config as nextConfig } from "./packages/eslint-config/next.js";
import { config as nodeConfig } from "./packages/eslint-config/node.js";

/** @type {import("eslint").Linter.Config[]} */

export default [
    ...nodeConfig.map((config) => ({
        ...config,
        files: ["apps/api/src/**/*.ts", "packages/database/src/**/*.ts"],
    })),
    ...nextConfig.map((config) => ({
        ...config,
        files: ["apps/web/**/*.{ts,tsx}"],
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
