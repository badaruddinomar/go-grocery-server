import validator from '@/middlewares/validator';
import express from 'express';
import { getUserByIdSchema, getUsersSchema } from '@/modules/user/user.dto';
import {
  getUserController,
  getUsersController,
} from '@/modules/user/user.controller';
import { authorizeRoles } from '@/middlewares/roleGuard';
import { UserRole } from '@/generated/prisma';
import { authMiddleware } from '@/middlewares/authGuard';

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validator(getUsersSchema),
  getUsersController,
);
router.get(
  '/:id',
  authMiddleware,
  authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
  validator(getUserByIdSchema),
  getUserController,
);

export default router;
