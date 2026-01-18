import z from 'zod';

export const registerSchema = {
  body: z.object({
    email: z
      .email({ message: 'Invalid email format' })
      .transform((val) => val.trim().toLowerCase()),
    name: z.string().min(1, 'Name is required').trim(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .trim(),
    phone: z
      .string()
      .regex(/^(?:\+8801|01)[3-9]\d{8}$/, 'Invalid phone number')
      .trim()
      .optional(),
    address: z.string().min(1, 'Address is required').trim().optional(),
  }),
};
export type RegisterSchema = {
  body: z.infer<typeof registerSchema.body>;
};
