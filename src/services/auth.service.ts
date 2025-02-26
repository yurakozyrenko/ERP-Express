import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import { IUser } from '../utils/interfaces';
import ApiError from '../error/ApiError';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_refresh_secret';

const tokenStorage = new Map(); // Для хранения refresh-токенов

class AuthService {
  async signup({ id, password }: IUser) {
    const existingUser = await User.findOne({ where: { id } });

    if (existingUser) {
      throw ApiError.conflict('User with this email already exists');
    }

    const user = await User.create({ id, password });

    return { message: 'User registered', userId: user.id };
  }

  async signin({ id, password }: IUser) {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized(`Invalid credentials`);
    }

    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: '10m',
    });

    const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });

    tokenStorage.set(user.id, refreshToken); // Сохраняем refresh-токен

    return { accessToken, refreshToken };
  }

}

export default new AuthService();
