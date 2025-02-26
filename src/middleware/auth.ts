import { Request, Response, NextFunction } from 'express';
import ApiError from '../error/ApiError';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

interface AuthRequest extends Request {
  user?: { id: string }; // 👈 Добавляем user в Request
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Token required'));
  }
  const token = authHeader.split(' ')[1];

  try {
    // Проверяем токен на корректность
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    // Передаём данные пользователя в `req.user`
    req.user = decoded;
    next();
  } catch (e) {
    return next(ApiError.unauthorized('Invalid or expired token'));
  }
};

export default authMiddleware;
