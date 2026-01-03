import sendResponse from '@/utils/sendResponse';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const notFound = (_req: Request, res: Response, _next: NextFunction) => {
  sendResponse(res, {
    success: false,
    statusCode: httpStatus.NOT_FOUND,
    message: 'API route not found',
  });
};

export default notFound;
