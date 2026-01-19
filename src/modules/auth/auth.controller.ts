import { Request, Response, RequestHandler } from 'express';
import httpStatus from 'http-status';
import asyncHandler from '@/utils/asyncHandler';
import sendResponse from '@/utils/sendResponse';
import {
  registerUserService,
  verifyEmailService,
} from '@/modules/auth/auth.service';
import { RegisterSchema } from '@/modules/auth/auth.dto';

// Controller to handle user registration
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

// Controller to handle email verification.
export const verifyEmail: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, code } = req.body;

    await verifyEmailService(email, code);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Email verified successfully.',
    });
  },
);
