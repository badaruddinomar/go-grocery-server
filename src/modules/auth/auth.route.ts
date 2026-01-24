import express from 'express';
import {
  register,
  resendVerificationCode,
  verifyEmail,
} from '@/modules/auth/auth.controller';
import {
  registerSchema,
  resendCodeSchema,
  verifyEmailSchema,
} from '@/modules/auth/auth.dto';
import validator from '@/middlewares/validator';
import { rateLimiter } from '@/middlewares/rateLimiter';

const router = express.Router();

router.post(
  '/register',
  rateLimiter(1, 1 * 60 * 1000),
  validator(registerSchema),
  register,
);
router.post('/verify-email', validator(verifyEmailSchema), verifyEmail);
router.post(
  '/resend-code',
  rateLimiter(1, 1 * 60 * 1000),
  validator(resendCodeSchema),
  resendVerificationCode,
);

export default router;
