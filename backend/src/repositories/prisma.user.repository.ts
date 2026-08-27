import type { PrismaClient } from "@prisma/client";
import type { CreateUserData, UserRepository } from "./user.repository.js";

export default class PrismaUserRepository implements UserRepository {
    constructor(private prisma: PrismaClient) {}

    async create(data: CreateUserData) {
        return this.prisma.user.create({ data });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }
}
