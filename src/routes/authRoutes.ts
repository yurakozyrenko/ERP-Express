import { Router } from "express";
import authController from "../controllers/authController";
import { body } from "express-validator"; // Для валидации входных данных

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API для аутентификации пользователей
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Ошибка валидации
 */
router.post(
  "/signup",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  authController.signup
);

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Вход пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Успешный вход
 *       401:
 *         description: Неверные учетные данные
 */
router.post("/signin", authController.signin);

/**
 * @swagger
 * /api/auth/signin/new_token:
 *   post:
 *     summary: Обновление JWT токена по refresh-токену
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "refresh-token"
 *     responses:
 *       200:
 *         description: Новый access-токен успешно выдан
 *       403:
 *         description: Refresh-токен недействителен
 */
router.post("/signin/new_token", authController.refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Выход пользователя (отключение текущих токенов)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Успешный выход
 *       401:
 *         description: Пользователь не авторизован
 */
router.post("/logout", authController.logout);

export default router;
