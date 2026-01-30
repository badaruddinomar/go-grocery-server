import sendResponse from '@/utils/sendResponse';
import { Request, Response } from 'express';
import {
  deleteUserService,
  getUserService,
  getUsersService,
} from '@/modules/user/user.service';
import asyncHandler from '@/utils/asyncHandler';
import { GetUserByIdSchema, GetUsersSchema } from '@/modules/user/user.dto';
import { UserWithoutPassword } from '@/modules/user/user.interface';

export const getUsersController = asyncHandler(
  async (req: Request, res: Response) => {
    // Extract query parameters
    const { page, limit, sort, search } =
      req.query as unknown as GetUsersSchema['query'];

    const result = await getUsersService({ page, limit, sort, search });

    sendResponse<UserWithoutPassword[]>(res, {
      statusCode: 200,
      success: true,
      message: 'Users retrieved successfully',
      data: result.data,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        itemsPerPage: result.limit,
        hasNextPage: result.currentPage < result.totalPages,
        hasPreviousPage: result.currentPage > 1,
      },
    });
  },
);

// Get user by ID controller
export const getUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params as unknown as GetUserByIdSchema['params'];

    const user = await getUserService({ id });

    sendResponse<UserWithoutPassword>(res, {
      statusCode: 200,
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  },
);

// Delete user controller
export const deleteUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params as unknown as GetUserByIdSchema['params'];

    await deleteUserService({ id });

    sendResponse<null>(res, {
      statusCode: 200,
      success: true,
      message: 'User deleted successfully',
      data: null,
    });
  },
);
