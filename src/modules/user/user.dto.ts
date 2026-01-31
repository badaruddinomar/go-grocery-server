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

// Update user DTO
export const updateUserSchema = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    name: z.string().trim().min(2).max(100).optional(),
    phone: z
      .string()
      .regex(/^(?:\+8801|01)[3-9]\d{8}$/, 'Invalid phone number')
      .trim()
      .optional(),
    address: z.string().min(1, 'Address is required').trim().optional(),
  }),
};
export type UpdateUserSchema = {
  params: z.infer<typeof updateUserSchema.params>;
  body: z.infer<typeof updateUserSchema.body>;
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

// Change password DTO
export const changePasswordSchema = {
  body: z.object({
    currentPassword: z
      .string()
      .min(6, 'Current password must be at least 6 characters long'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters long'),
  }),
};

export type ChangePasswordSchema = {
  body: z.infer<typeof changePasswordSchema.body>;
};
