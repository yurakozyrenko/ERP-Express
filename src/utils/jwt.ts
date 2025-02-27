import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your_secret_key',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',
  accessExpires: process.env.JWT_ACCESS_EXPIRES || '10m',
  refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
};

export function generateTokens(userId: string, deviceId: string): { accessToken: string; refreshToken: string } {
  return {
    accessToken: jwt.sign({ id: userId, deviceId }, jwtConfig.secret, { expiresIn: jwtConfig.accessExpires } as SignOptions),
    refreshToken: jwt.sign({ id: userId, deviceId }, jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpires } as SignOptions),
  };
}

export function verifyAccessToken(token: string): (JwtPayload & { id: string; deviceId: string }) | null {
  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as JwtPayload;

    if (typeof decoded === 'object' && 'id' in decoded && 'deviceId' in decoded) {
      return decoded as JwtPayload & { id: string; deviceId: string };
    }
    return null;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, jwtConfig.refreshSecret) as JwtPayload;
  } catch {
    return null;
  }
}
