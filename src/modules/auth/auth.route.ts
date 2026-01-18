import express from 'express';
import { register } from '@/modules/auth/auth.controller';
import { registerSchema } from '@/modules/auth/auth.dto';
import validator from '@/middlewares/validator';

const router = express.Router();

router.post('/register', validator(registerSchema), register);

export default router;
