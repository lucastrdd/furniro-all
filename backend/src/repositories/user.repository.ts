import type { User } from "@prisma/client";

export type CreateUserData = {
    email: string;
    password: string;
};

export interface UserRepository {
    create(data: CreateUserData): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
}
