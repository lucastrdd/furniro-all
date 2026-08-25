import "dotenv/config";
import type { SignOptions } from "jsonwebtoken";
import { z } from "zod";

const authEnvironmentSchema = z.object({
    JWT_SECRET: z
        .string()
        .min(32, "JWT_SECRET must contain at least 32 characters"),
    JWT_EXPIRES_IN: z.string().min(1).default("1d"),
});

const environment = authEnvironmentSchema.safeParse(process.env);

if (!environment.success) {
    throw new Error(
        environment.error.issues[0]?.message ??
            "Invalid authentication environment variables",
    );
}

export const authConfig = {
    jwtSecret: environment.data.JWT_SECRET,
    jwtExpiresIn: environment.data.JWT_EXPIRES_IN as NonNullable<
        SignOptions["expiresIn"]
    >,
};
