import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AppError } from '@/utils/appError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import { User } from '@/generated/prisma';
import { prisma } from '@/utils/prismaClient';
import envConfig from '@/config/env.config';

export const authMiddleware: RequestHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new AppError(
      'Please login to access this resource.',
      httpStatus.UNAUTHORIZED,
    );
  }

  const decodedData = jwt.verify(token, envConfig.jwt_secret) as JwtPayload;

  const user = await prisma.user.findUnique({
    where: { userId: decodedData?.userId },
  });

  if (!user) {
    throw new AppError(
      'User no longer exists. Please login again.',
      httpStatus.UNAUTHORIZED,
    );
  }

  if (!user.isVerified) {
    throw new AppError('Please verify your email.', httpStatus.UNAUTHORIZED);
  }

  req.user = user as User;
  next();
};
