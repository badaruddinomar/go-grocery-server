import { Request, Response, RequestHandler } from 'express';
import httpStatus from 'http-status';
import asyncHandler from '@/utils/asyncHandler';
import sendResponse from '@/utils/sendResponse';
import {
  forgotPasswordService,
  loginUserService,
  registerUserService,
  resendVerificationCodeService,
  resetPasswordService,
  verifyEmailService,
} from '@/modules/auth/auth.service';
import { RegisterSchema } from '@/modules/auth/auth.dto';

// Controller to handle user registration
export const registerUserController: RequestHandler = asyncHandler(
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
export const verifyEmailController: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, code } = req.body;

    await verifyEmailService({ email, code });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Email verified successfully.',
    });
  },
);

// Controller to handle resending verification code
export const resendVerificationCodeController: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    await resendVerificationCodeService(email);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Verification code resent successfully.',
    });
  },
);

// Controller to handle user login
export const loginUserController: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await loginUserService({ email, password });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User logged in successfully.',
      data: result.user,
      meta: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  },
);

// Controller to handle forgot password
export const forgotPasswordController: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    await forgotPasswordService(email);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Password reset link sent successfully.',
    });
  },
);

// Controller to handle reset password
export const resetPasswordController: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, code, newPassword } = req.body;

    await resetPasswordService({ email, code, newPassword });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Password reset successfully.',
    });
  },
);
