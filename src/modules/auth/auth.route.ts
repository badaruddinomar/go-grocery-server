import express from 'express';
import {
  forgotPasswordController,
  loginUserController,
  registerUserController,
  resendVerificationCodeController,
  resetPasswordController,
  verifyEmailController,
} from '@/modules/auth/auth.controller';
import {
  forgotPasswordSchema,
  loginUserSchema,
  registerUserSchema,
  resendCodeSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '@/modules/auth/auth.dto';
import validator from '@/middlewares/validator';
import { rateLimiter } from '@/middlewares/rateLimiter';

const router = express.Router();

router.post(
  '/register',
  rateLimiter(1, 1 * 60 * 1000),
  validator(registerUserSchema),
  registerUserController,
);
router.post(
  '/verify-email',
  validator(verifyEmailSchema),
  verifyEmailController,
);
router.post(
  '/resend-code',
  rateLimiter(1, 1 * 60 * 1000),
  validator(resendCodeSchema),
  resendVerificationCodeController,
);
router.post('/login', validator(loginUserSchema), loginUserController);
router.post(
  '/forgot-password',
  rateLimiter(1, 1 * 60 * 1000),
  validator(forgotPasswordSchema),
  forgotPasswordController,
);
router.post(
  '/reset-password',
  validator(resetPasswordSchema),
  resetPasswordController,
);

export default router;
