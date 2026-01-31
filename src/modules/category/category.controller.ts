import sendResponse from '@/utils/sendResponse';
import { Request, RequestHandler, Response } from 'express';
import statusCode from 'http-status';
import { CreateCategorySchema } from '@/modules/category/category.dto';
import { createCategoryService } from '@/modules/category/category.service';

export const createCategoryController: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const body = req.body as CreateCategorySchema['body'];
  const file = req.files;

  const result = await createCategoryService(body, file);

  sendResponse(res, {
    success: true,
    statusCode: statusCode.CREATED,
    message: 'Category created successfully',
    data: result,
  });
};
