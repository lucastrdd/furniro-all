import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { authConfig } from "../config/auth.config.js";
import { UnauthorizedException } from "./http-exception.middleware.js";

type AuthenticationPayload = JwtPayload & {
    sub: string;
    email: string;
};

const isAuthenticationPayload = (
    payload: string | JwtPayload,
): payload is AuthenticationPayload => {
    return (
        typeof payload !== "string" &&
        typeof payload.sub === "string" &&
        payload.sub.length > 0 &&
        typeof payload["email"] === "string" &&
        payload["email"].length > 0
    );
};

export const authenticate = (
    req: Request,
    _res: Response,
    next: NextFunction,
): void => {
    const authorization = req.headers.authorization;
    const [scheme, token, ...additionalParts] =
        authorization?.trim().split(/\s+/) ?? [];

    if (
        scheme?.toLowerCase() !== "bearer" ||
        !token ||
        additionalParts.length > 0
    ) {
        next(new UnauthorizedException("Authentication is required"));
        return;
    }

    try {
        const payload = jwt.verify(token, authConfig.jwtSecret, {
            algorithms: ["HS256"],
        });

        if (!isAuthenticationPayload(payload)) {
            throw new UnauthorizedException("Invalid authentication token");
        }

        req.auth = {
            userId: payload.sub,
            email: payload.email,
        };

        next();
    } catch {
        next(
            new UnauthorizedException(
                "Invalid or expired authentication token",
            ),
        );
    }
};
