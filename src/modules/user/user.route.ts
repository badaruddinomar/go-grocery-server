import validator from '@/middlewares/validator';
import express from 'express';
import {
  changePasswordSchema,
  deleteUserSchema,
  getUserByIdSchema,
  getUsersSchema,
  updateUserSchema,
} from '@/modules/user/user.dto';
import {
  changePasswordController,
  deleteUserController,
  getUserController,
  getUsersController,
  updateUserController,
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

router.patch(
  '/change-password',
  authMiddleware,
  validator(changePasswordSchema),
  changePasswordController,
);

router.get(
  '/:id',
  authMiddleware,
  authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
  validator(getUserByIdSchema),
  getUserController,
);

router.patch(
  '/:id',
  authMiddleware,
  authorizeRoles(
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.SUPPORT,
  ),
  validator(updateUserSchema),
  updateUserController,
);

router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validator(deleteUserSchema),
  deleteUserController,
);

export default router;
