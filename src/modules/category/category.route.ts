import { authMiddleware } from '@/middlewares/authGuard';
import { authorizeRoles } from '@/middlewares/roleGuard';
import express from 'express';
import { createCategoryController } from '@/modules/category/category.controller';

const router = express.Router();

router.post(
  '/create',
  authMiddleware,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  createCategoryController,
);

export default router;
