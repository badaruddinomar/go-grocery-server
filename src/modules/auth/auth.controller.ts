import { Request, Response, RequestHandler } from 'express';
import httpStatus from 'http-status';
import asyncHandler from '@/utils/asyncHandler';
import sendResponse from '@/utils/sendResponse';
import { registerUserService } from './auth.service';
import { RegisterSchema } from '@/modules/auth/auth.dto';

export const register: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await registerUserService(req.body as RegisterSchema['body']);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'User registered successfully. Verification code sent.',
      data: user,
    });
  },
);
