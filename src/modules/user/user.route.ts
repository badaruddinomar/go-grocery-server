import validator from '@/middlewares/validator';
import express from 'express';
import { getUsersSchema } from '@/modules/user/user.dto';
import { getUsersController } from '@/modules/user/user.controller';

const router = express.Router();

router.get('/', validator(getUsersSchema), getUsersController);

export default router;
