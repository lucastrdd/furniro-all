import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import CartController from "../controllers/cart.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import PrismaCartRepository from "../repositories/prisma.cart.repository.js";
import { CartService } from "../services/cart.service.js";

const router = Router();
const prisma = new PrismaClient();
const cartRepository = new PrismaCartRepository(prisma);
const cartService = new CartService(cartRepository);
const cartController = new CartController(cartService);

router.use(authenticate);
router.get("/", (req, res, next) => cartController.getCart(req, res, next));
router.post("/merge", (req, res, next) =>
    cartController.mergeCart(req, res, next),
);
router.post("/items", (req, res, next) =>
    cartController.addItem(req, res, next),
);
router.put("/items/:itemId", (req, res, next) =>
    cartController.updateItem(req, res, next),
);
router.delete("/items/:itemId", (req, res, next) =>
    cartController.removeItem(req, res, next),
);

export { router as cartRoutes };
