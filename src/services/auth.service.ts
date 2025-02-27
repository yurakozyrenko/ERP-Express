import bcrypt from 'bcryptjs';

import User from '../models/user';
import { IUser } from '../utils/interfaces';
import ApiError from '../error/ApiError';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import Token from '../models/token';

class AuthService {
  async signup({ id, password }: IUser) {
    const existingUser = await User.findOne({ where: { id } });

    if (existingUser) {
      throw ApiError.conflict('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ id, password: hashedPassword });

    const { accessToken, refreshToken } = generateTokens(user.id);

    return { message: 'User registered', accessToken, refreshToken };
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

    const { accessToken, refreshToken } = generateTokens(user.id);

    // Сохраняем токен в БД
    await Token.upsert({
      userId: user.id,
      refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.forbidden('No token provided');
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw ApiError.forbidden('Invalid token');
    }

    const tokenData = await Token.findOne({ where: { userId: decoded.id, refreshToken } });
    if (!tokenData) {
      throw ApiError.forbidden('Token revoked');
    }

    const tokens = generateTokens(decoded.id);

    // Обновляем refresh-токен в БД
    await tokenData.update({
      refreshToken: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
    });

    return tokens;
  }

  async logout(userId: string) {
    // Удаляем refresh-токен из БД
    await Token.destroy({ where: { userId } });
  }
}

export default new AuthService();
