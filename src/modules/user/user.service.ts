import { AppError } from '@/utils/appError';
import { GetUserByIdSchema, GetUsersSchema } from '@/modules/user/user.dto';
import { Prisma } from '@/generated/prisma';
import { prisma } from '@/utils/prismaClient';
import { GetUsersServiceResult } from '@/modules/user/user.interface';
import bcryptjs from 'bcryptjs';

export const getUsersService = async (
  query: GetUsersSchema['query'],
): Promise<GetUsersServiceResult> => {
  const { page, limit, sort, search } = query;

  const skip = (page - 1) * limit; // Calculate the number of documents to skip

  // Build the search filter
  const where: Prisma.UserWhereInput = {};
  if (search && search.trim() !== '') {
    // Search by user name
    where.name = {
      contains: search,
      mode: 'insensitive',
    };
  }

  // Retrive users from the database
  const users = await prisma.user.findMany({
    where,
    omit: { password: true },
    take: limit,
    skip: skip,
    orderBy: { createdAt: sort === 'asc' ? 'asc' : 'desc' },
  });

  // Count total users matching the search criteria
  const totalUsers = await prisma.user.count({
    where,
  });

  return {
    data: users,
    totalItems: totalUsers,
    totalPages: Math.ceil(totalUsers / limit),
    limit: parseInt(limit.toString()),
    currentPage: parseInt(page.toString()),
  };
};

// Get user by ID service (to be implemented)
export const getUserService = async (query: GetUserByIdSchema['params']) => {
  const { id } = query;

  const user = await prisma.user.findUnique({
    where: { userId: id },
    omit: { password: true },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

// Update user service
export const updateUserService = async (
  param: GetUserByIdSchema['params'],
  updateData: Partial<Prisma.UserUpdateInput>,
) => {
  const { id } = param;

  const user = await prisma.user.findUnique({
    where: { userId: id },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const updatedUser = await prisma.user.update({
    where: { userId: id },
    data: updateData,
    omit: { password: true },
  });

  return updatedUser;
};

//  Delete user service
export const deleteUserService = async (query: GetUserByIdSchema['params']) => {
  const { id } = query;

  const user = await prisma.user.findUnique({
    where: { userId: id },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  await prisma.user.delete({
    where: { userId: id },
  });
};

// Change password service
export const changePasswordService = async (
  userId: number,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await prisma.user.findUnique({
    where: { userId },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }
  const verifyPassword = await bcryptjs.compare(currentPassword, user.password);

  if (!verifyPassword) {
    throw new AppError('Current password is incorrect', 400);
  }

  const salt = await bcryptjs.genSalt(10);
  newPassword = await bcryptjs.hash(newPassword, salt);

  await prisma.user.update({
    where: { userId },
    data: { password: newPassword },
  });
};
