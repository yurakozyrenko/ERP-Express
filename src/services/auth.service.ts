import bcrypt from 'bcryptjs';

import User from '../models/user';
import { IUser } from '../utils/interfaces';
import ApiError from '../error/ApiError';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import Token from '../models/token';
import { v4 as uuidv4 } from 'uuid';

class AuthService {
  async signup({ id, password }: IUser) {
    const existingUser = await User.findOne({ where: { id } });

    if (existingUser) {
      throw ApiError.conflict('User with this ID already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ id, password: hashedPassword });

    const deviceId = uuidv4();

    const { accessToken, refreshToken } = generateTokens(user.id, deviceId);

    await Token.create({
      userId: user.id,
      refreshToken,
      deviceId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

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

    const deviceId = uuidv4();

    const tokens = generateTokens(user.id, deviceId);

    await Token.create({
      userId: user.id,
      refreshToken: tokens.refreshToken,
      deviceId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.forbidden('No token or device ID provided');
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw ApiError.forbidden('Invalid token');
    }

    const tokenData = await Token.findOne({ where: { userId: decoded.id, refreshToken } });
    if (!tokenData) {
      throw ApiError.forbidden('Token revoked');
    }

    if (new Date(tokenData.expiresAt) < new Date()) {
      await tokenData.destroy();
      throw ApiError.forbidden('Invalid token');
    }

    const newTokens = generateTokens(decoded.id, tokenData.deviceId);

    await tokenData.update({
      refreshToken: newTokens.refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return newTokens;
  }

  async logout(userId: string, deviceId: string) {
    if (!userId || !deviceId) {
      throw ApiError.unauthorized('User ID and device ID are required');
    }

    const tokenData = await Token.findOne({ where: { userId, deviceId } });

    if (tokenData) {
      await tokenData.destroy();
    }
  }

  async logoutAll(userId: string) {
    if (!userId) {
      throw ApiError.unauthorized('User ID is required');
    }

    await Token.destroy({ where: { userId } });
  }
}

export default new AuthService();
