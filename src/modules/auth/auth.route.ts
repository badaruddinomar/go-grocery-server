import express from 'express';
import { register, verifyEmail } from '@/modules/auth/auth.controller';
import { registerSchema, verifyEmailSchema } from '@/modules/auth/auth.dto';
import validator from '@/middlewares/validator';

const router = express.Router();

router.post('/register', validator(registerSchema), register);
router.post('/verify-email', validator(verifyEmailSchema), verifyEmail);

export default router;
