import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import type { UserRepository } from "../repositories/user.repository.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema.js";
import { authConfig } from "../config/auth.config.js";
import {
    ConflictException,
    UnauthorizedException,
} from "../middlewares/http-exception.middleware.js";

export type AuthenticatedUser = {
    id: string;
    email: string;
    createdAt: Date;
};

export type LoginResult = {
    token: string;
    user: AuthenticatedUser;
};

export class AuthService {
    constructor(private userRepository: UserRepository) {}

    async register({
        email,
        password,
    }: RegisterInput): Promise<AuthenticatedUser> {
        const existingUser = await this.userRepository.findByEmail(email);

        if (existingUser) {
            throw new ConflictException("Email is already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        let user: Awaited<ReturnType<UserRepository["create"]>>;

        try {
            user = await this.userRepository.create({
                email,
                password: hashedPassword,
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002"
            ) {
                throw new ConflictException("Email is already registered");
            }

            throw error;
        }

        return this.toAuthenticatedUser(user);
    }

    async login({ email, password }: LoginInput): Promise<LoginResult> {
        const user = await this.userRepository.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException("Invalid email or password");
        }

        const authenticatedUser = this.toAuthenticatedUser(user);
        const tokenOptions: SignOptions = {
            subject: authenticatedUser.id,
            expiresIn: authConfig.jwtExpiresIn,
        };
        const token = jwt.sign(
            { email: authenticatedUser.email },
            authConfig.jwtSecret,
            tokenOptions,
        );

        return { token, user: authenticatedUser };
    }

    private toAuthenticatedUser(
        user: Awaited<ReturnType<UserRepository["create"]>>,
    ): AuthenticatedUser {
        return {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
        };
    }
}
