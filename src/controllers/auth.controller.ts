import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/auth.service';
import ApiError from '../error/ApiError';
import { validationResult } from 'express-validator';

class AuthController {
  // Регистрация пользователя
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.badRequest('Ошибка валидации', errors.array()));
      }

      const { id, password } = req.body;
      const response = await AuthService.signup({ id, password });

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Вход пользователя
  async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.badRequest('Ошибка валидации', errors.array()));
      }

      const { id, password } = req.body;

      const tokens = await AuthService.signin({ id, password });

      res.status(200).json(tokens);
    } catch (error) {
      next(error);
    }
  }

  // Обновление JWT-токена
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const tokens = await AuthService.refreshToken(refreshToken);
      res.json(tokens);
    } catch (error) {
      next(error);
    }
  }

  // Логаут пользователя
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(ApiError.unauthorized('User not found'));
      }

      await AuthService.logout(req.user.id);

      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(ApiError.unauthorized('User not found'));
      }

      res.json({ id: req.user.id });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
