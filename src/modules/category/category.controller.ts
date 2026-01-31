import sendResponse from '@/utils/sendResponse';
import { Request, Response } from 'express';
import statusCode from 'http-status';

export const createCategoryController = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  const result = await createCategoryService({ name, description });
  sendResponse(res, {
    success: true,
    statusCode: statusCode.CREATED,
    message: 'Category created successfully',
    data: result,
  });
};
