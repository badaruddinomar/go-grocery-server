import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import sendResponse from '@/utils/sendResponse';
export const rateLimiter = (maxRequests: number, time: number) => {
  return rateLimit({
    max: maxRequests,
    windowMs: time,
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response, _next: NextFunction) => {
      sendResponse(res, {
        success: false,
        statusCode: httpStatus.TOO_MANY_REQUESTS,
        message: 'Too many requests, please try again later',
      });
    },
  });
};
