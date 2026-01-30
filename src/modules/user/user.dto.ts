import { z } from 'zod';

// DTO for get all users
export const getUsersSchema = {
  query: z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
    sort: z.enum(['asc', 'desc']).optional().default('desc'),
    search: z.string().trim().optional(),
  }),
};
export type GetUsersSchema = {
  query: z.infer<typeof getUsersSchema.query>;
};

// Get user by ID DTO
export const getUserByIdSchema = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};
export type GetUserByIdSchema = {
  params: z.infer<typeof getUserByIdSchema.params>;
};

// Get user by ID DTO
export const deleteUserSchema = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};
export type DeleteUserSchema = {
  params: z.infer<typeof deleteUserSchema.params>;
};
