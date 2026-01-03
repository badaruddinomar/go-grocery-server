import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/appError';
import httpStatus from 'http-status';
import { UserRole } from '@/generated/prisma/edge';

// Authorize Roles--
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role as UserRole)) {
      throw new AppError(
        `Permission denied! Your are not allowed to access this resource.`,
        httpStatus.FORBIDDEN,
      );
    }
    next();
  };
};
