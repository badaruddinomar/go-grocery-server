import { AppError } from '@/utils/appError';
import { GetUsersSchema } from '@/modules/user/user.dto';
import { Prisma } from '@/generated/prisma';
import { prisma } from '@/utils/prismaClient';
import { GetUsersServiceResult } from '@/modules/user/user.interface';

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
