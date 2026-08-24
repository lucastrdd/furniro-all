import type { NextFunction, Request, Response } from "express";
import type { AuthService } from "../services/auth.service.js";
import { registerSchema } from "../schemas/auth.schema.js";
import { BadRequestException } from "../middlewares/http-exception.middleware.js";
import logger from "../utils/logger/logger.js";

export default class AuthController {
    constructor(private authService: AuthService) {}

    async register(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const validation = registerSchema.safeParse(req.body);

            if (!validation.success) {
                throw new BadRequestException(
                    validation.error.issues[0]?.message ??
                        "Invalid registration data",
                );
            }

            const user = await this.authService.register(validation.data);

            logger.info(`User registered successfully: ${user.id}`);
            res.status(201).json({ user });
        } catch (error) {
            logger.error(
                `Error registering user: ${error instanceof Error ? error.message : String(error)}`,
            );
            next(error);
        }
    }
}
