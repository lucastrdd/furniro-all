import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import PrismaUserRepository from "../repositories/prisma.user.repository.js";
import { AuthService } from "../services/auth.service.js";

const router = Router();

const prisma = new PrismaClient();
const userRepository = new PrismaUserRepository(prisma);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post("/register", (req, res, next) =>
    authController.register(req, res, next),
);
router.post("/login", (req, res, next) => authController.login(req, res, next));

export { router as authRoutes };
