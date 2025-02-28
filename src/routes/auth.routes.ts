import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth';
import { signupValidation } from '../validations/authValidation';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API для аутентификации пользователей
 */

/**
 * @swagger
 * /signup:
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
 *               - id
 *               - password
 *             properties:
 *               id:
 *                 type: string
 *                 description: "Email или номер телефона"
 *                 example: "user@example.com" # или "79991234567"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Ошибка валидации
 *       409:
 *         description: User with this ID already exists
 */

router.post('/signup', signupValidation, validateRequest, AuthController.signup);

/**
 * @swagger
 * /signin:
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
 *               - id
 *               - password
 *             properties:
 *               id:
 *                 type: string
 *                 example: "user@example.com" # или "79991234567"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Успешный вход
 *       401:
 *         description: Неверные учетные данные
 */
router.post('/signin', signupValidation, validateRequest, AuthController.signin);

/**
 * @swagger
 * /signin/new_token:
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
 *       401:
 *         description: Token required
 *       403:
 *         description: Refresh-токен недействителен
 */
router.post('/signin/new_token', authMiddleware, AuthController.refreshToken);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Выход из системы на конкретном устройстве
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Успешный выход с устройства
 *       401:
 *         description: Пользователь не авторизован
 */
router.get('/logout', authMiddleware, AuthController.logout);

/**
 * @swagger
 * /info:
 *   get:
 *     summary: Получить информацию о текущем пользователе
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Успешный ответ с ID пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 123
 *       401:
 *         description: Неавторизован
 */
router.get('/info', authMiddleware, AuthController.getUserInfo);

/**
 * @swagger
 * /logout/all:
 *   get:
 *     summary: Выход со всех устройств
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Пользователь вышел со всех устройств
 *       401:
 *         description: Пользователь не авторизован
 */
router.get('/logout/all', authMiddleware, AuthController.logoutAll);

export default router;
