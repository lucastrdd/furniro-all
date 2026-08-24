import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import type { UserRepository } from "../repositories/user.repository.js";
import type { RegisterInput } from "../schemas/auth.schema.js";
import { ConflictException } from "../middlewares/http-exception.middleware.js";

export type RegisteredUser = {
    id: string;
    email: string;
    createdAt: Date;
};

export class AuthService {
    constructor(private userRepository: UserRepository) {}

    async register({
        email,
        password,
    }: RegisterInput): Promise<RegisteredUser> {
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

        return {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
        };
    }
}
