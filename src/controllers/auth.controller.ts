import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import authServices from '../services/auth.service';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_refresh_secret';
const tokenStorage = new Map(); // Для хранения refresh-токенов

class AuthController {
  // Регистрация пользователя
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      await authServices.signup({ email, password: hashedPassword });

      res.status(201).json({ message: 'User registered' });
    } catch (error) {
      next(error);
    }
  }

  // Вход пользователя
  async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const result = await authServices.signin({ email, password });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Обновление JWT-токена
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(403).json({ error: 'No token provided' });
      }

      jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err: any, decoded: any) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });

        const accessToken = jwt.sign({ id: decoded.id }, JWT_SECRET, {
          expiresIn: '10m',
        });
        res.json({ accessToken });
      });
    } catch (error) {
      //   return res.status(500).json({ error: "Token refresh failed" });
      next(error); // Передача ошибки в обработчик ошибок Express
    }
  }

  // Логаут пользователя
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body;
      tokenStorage.delete(userId); // Удаляем refresh-токен
      res.status(200).json({ message: 'Logged out' });
    } catch (error) {
      //   return res.status(500).json({ error: "Logout failed" });
      next(error); // Передача ошибки в обработчик ошибок Express
    }
  }
}

export default new AuthController();
