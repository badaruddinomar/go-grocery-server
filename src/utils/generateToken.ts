import jwt from 'jsonwebtoken';
import { User } from '@/generated/prisma';
import envConfig from '@/config/env.config';

export const generateToken = (user: User, exp: number) => {
  const token = jwt.sign(
    { userId: user.userId, email: user.email, role: user.role },
    envConfig.jwt_secret,
    {
      expiresIn: exp,
    },
  );
  return token;
};
