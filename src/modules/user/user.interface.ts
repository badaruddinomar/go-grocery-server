import { User } from '@/generated/prisma';

export type UserWithoutPassword = Omit<User, 'password'>;

export interface GetUsersServiceResult {
  data: UserWithoutPassword[];
  totalItems: number;
  totalPages: number;
  limit: number;
  currentPage: number;
}
