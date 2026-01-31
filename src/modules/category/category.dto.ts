import { z } from 'zod';

// DTO for create category
export const createCategorySchema = {
  body: z.object({
    name: z.string().trim().min(2).max(100),
    description: z.string().trim().optional(),
  }),
};
export type CreateCategorySchema = {
  body: z.infer<typeof createCategorySchema.body>;
};
