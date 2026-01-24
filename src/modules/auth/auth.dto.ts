import z from 'zod';

// DTO for user registration
export const registerUserSchema = {
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
  body: z.infer<typeof registerUserSchema.body>;
};

// DTO for email verification
export const verifyEmailSchema = {
  body: z.object({
    email: z
      .email({ message: 'Invalid email format' })
      .transform((val) => val.trim().toLowerCase()),
    code: z
      .string()
      .length(6, 'Verification code must be 6 digits')
      .regex(/^\d{6}$/, 'Verification code must be numeric')
      .trim(),
  }),
};
export type VerifyEmailSchema = {
  body: z.infer<typeof verifyEmailSchema.body>;
};

// DTO for Resend verification code
export const resendCodeSchema = {
  body: z.object({
    email: z
      .email({ message: 'Invalid email format' })
      .transform((val) => val.trim().toLowerCase()),
  }),
};
export type ResendCodeSchema = {
  body: z.infer<typeof resendCodeSchema.body>;
};

// DTO for user login
export const loginUserSchema = {
  body: z.object({
    email: z
      .email({ message: 'Invalid email format' })
      .transform((val) => val.trim().toLowerCase()),
    password: z.string().min(1, 'Password is required').trim(),
  }),
};
export type LoginSchema = {
  body: z.infer<typeof loginUserSchema.body>;
};
