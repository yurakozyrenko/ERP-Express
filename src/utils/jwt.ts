import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your_secret_key',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',
  accessExpires: process.env.JWT_ACCESS_EXPIRES || '10m',
  refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
};

// Функция для генерации токенов
export function generateTokens(userId: string): { accessToken: string; refreshToken: string } {
  return {
    accessToken: jwt.sign({ id: userId }, jwtConfig.secret, { expiresIn: jwtConfig.accessExpires } as SignOptions),
    refreshToken: jwt.sign({ id: userId }, jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpires } as SignOptions),
  };
}

// Функция проверки access токена
export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, jwtConfig.secret) as JwtPayload;
  } catch {
    return null; 
  }
}

// Функция проверки refresh токена
export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, jwtConfig.refreshSecret) as JwtPayload;
  } catch {
    return null; 
  }
}
