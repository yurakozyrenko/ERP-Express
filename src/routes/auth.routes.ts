import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { body } from 'express-validator'; // Для валидации входных данных
import authMiddleware from '../middleware/auth';

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
 */

router.post(
  '/signup',
  body('id').custom((value) => {
    // Проверяем, является ли значение email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    // Проверяем, является ли значение номером телефона (начинается с цифры, 10-15 символов)
    const isPhone = /^\d{10,15}$/.test(value);

    if (!isEmail && !isPhone) {
      throw new Error('id должен быть email или номером телефона');
    }
    return true;
  }),
  body('password').isLength({ min: 6 }).withMessage('Пароль должен содержать минимум 6 символов'),
  AuthController.signup,
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
router.post('/signin', AuthController.signin);

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
router.post('/signin/new_token', authMiddleware, AuthController.refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Выход из системы
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Успешный выход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully logged out" 
 *       401:
 *         description: Пользователь не авторизован
 */
router.post('/logout',authMiddleware, AuthController.logout);

/**
 * @swagger
 * /api/auth/info:
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


export default router;
