import { config } from "dotenv";
import path from "path";
import { envSchema } from "./schemas.js";

const NODE_ENV = process.env.NODE_ENV;
config({
    path: path.resolve(process.cwd(), NODE_ENV === "development" ? ".env.local" : ".env"),
});

const parsedSchema = envSchema.safeParse(process.env);

if (!parsedSchema.success) {
    parsedSchema.error.issues.forEach((issue) => {
        console.error(`ENV Error: ${issue.path.join(", ")} -> invalid or missing`);
    });
    process.exit(1);
}

export const env = parsedSchema.data;
