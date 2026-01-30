import sendResponse from '@/utils/sendResponse';
import { Request, Response } from 'express';
import { getUsersService } from '@/modules/user/user.service';
import asyncHandler from '@/utils/asyncHandler';
import { GetUsersSchema } from './user.dto';

export const getUsersController = asyncHandler(
  async (req: Request, res: Response) => {
    // Extract query parameters
    const { page, limit, sort, search } =
      req.query as unknown as GetUsersSchema['query'];

    const result = await getUsersService({ page, limit, sort, search });

    sendResponse(res, {
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
