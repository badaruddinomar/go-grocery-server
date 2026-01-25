import {
  VerifyEmailSchema,
  RegisterSchema,
  LoginSchema,
  ResendCodeSchema,
} from '@/modules/auth/auth.dto';
import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status';
import { prisma } from '@/utils/prismaClient';
import { AppError } from '@/utils/appError';
import sendEmail from '@/utils/sendEmail';
import {
  forgotPasswordEmailTemplate,
  verifyEmailTemplate,
} from '@/templates/emailTemplates';
import redis from '@/config/redis.config';
import logger from '@/utils/logger';
import { generateToken } from '@/utils/generateToken';
import {
  UserLoginServiceResult,
  UserWithoutPassword,
} from '@/modules/auth/auth.interface';

// Service to handle user registration
export const registerUserService = async (
  payload: RegisterSchema['body'],
): Promise<UserWithoutPassword> => {
  const { email, name, password, phone, address } = payload;

  return await prisma.$transaction(async (tx) => {
    // 1. Check existing user
    const existingUser = await tx.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User already exists', httpStatus.BAD_REQUEST);
    }

    // 2. Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // 3. Create user
    const user = await tx.user.create({
      data: {
        name,
        email,
        phone,
        address,
        password: hashedPassword,
      },
      omit: { password: true },
    });

    // 4. Generate verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // 5. Store code in Redis
    const redisKey = `verify-email:${email}`;

    try {
      await redis.set(redisKey, verificationCode, 'EX', 60);
    } catch (error) {
      // ❌ Redis failed → rollback user creation
      logger.error(`Failed to store verification code in Redis: ${error}`);
      throw new AppError(
        'Failed to store verification code',
        httpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // 6. Send email
    try {
      await sendEmail({
        reciverEmail: email,
        subject: 'Verify your email',
        body: verifyEmailTemplate(verificationCode),
      });
    } catch (error) {
      // ❌ Email failed → rollback + cleanup Redis
      logger.error(`Failed to send verification email: ${error}`);
      await redis.del(redisKey);
      throw new AppError(
        'Failed to send verification email',
        httpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // 7. Everything succeeded
    return user;
  });
};

// Service to handle email verification
export const verifyEmailService = async (
  payload: VerifyEmailSchema['body'],
): Promise<void> => {
  const { email, code } = payload;
  const redisKey = `verify-email:${email}`;

  // 1. Get code from Redis
  const storedCode = await redis.get(redisKey);

  if (!storedCode) {
    throw new AppError(
      'Verification code expired or not found',
      httpStatus.BAD_REQUEST,
    );
  }

  // 2. Compare codes
  if (storedCode !== code) {
    throw new AppError('Invalid verification code', httpStatus.BAD_REQUEST);
  }

  // 3. Update user as verified
  await prisma.user.update({
    where: { email },
    data: { isVerified: true },
  });

  // 4. Delete code from Redis
  await redis.del(redisKey);
};

// Service to handle resending verification code
export const resendVerificationCodeService = async (
  payload: ResendCodeSchema['body'],
): Promise<void> => {
  const { email } = payload;
  // 1. Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }

  if (user.isVerified) {
    throw new AppError('Email is already verified', httpStatus.BAD_REQUEST);
  }

  // 2. Generate new verification code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  // 3. Store new code in Redis
  const redisKey = `verify-email:${email}`;

  try {
    await redis.set(redisKey, verificationCode, 'EX', 60);
  } catch (error) {
    logger.error(`Failed to store verification code in Redis: ${error}`);
    throw new AppError(
      'Failed to store verification code',
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  // 4. Send email
  try {
    await sendEmail({
      reciverEmail: email,
      subject: 'Verify your email',
      body: verifyEmailTemplate(verificationCode),
    });
  } catch (error) {
    logger.error(`Failed to send verification email: ${error}`);
    await redis.del(redisKey);
    throw new AppError(
      'Failed to send verification email',
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

// Service to handle user login
export const loginUserService = async (
  payload: LoginSchema['body'],
): Promise<UserLoginServiceResult> => {
  const { email, password } = payload;

  // 1. Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Invalid credentials', httpStatus.UNAUTHORIZED);
  }

  // 2. Check if email is verified
  if (!user.isVerified) {
    throw new AppError('Please verify your email.', httpStatus.UNAUTHORIZED);
  }

  // 3. Compare passwords
  const isPasswordValid = await bcryptjs.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', httpStatus.UNAUTHORIZED);
  }

  // 4. Generate access token
  const accessToken = generateToken(user, 900); // 15 minutes
  const refreshToken = generateToken(user, 604800); // 7 days
  // 5. Omit password from user object
  const { password: _, ...userWithoutPassword } = user;
  // send response data
  return { user: userWithoutPassword, accessToken, refreshToken };
};

// Service to handle forgot password
export const forgotPasswordService = async (email: string): Promise<void> => {
  // 1. Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }

  // 2. Generate password reset code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  // 3. Store reset code in Redis
  const redisKey = `forgot-password:${email}`;

  try {
    await redis.set(redisKey, resetCode, 'EX', 60); // Expires in 10 minutes
  } catch (error) {
    logger.error(`Failed to store reset code in Redis: ${error}`);
    throw new AppError(
      'Failed to store reset code',
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  // 4. Send email with reset code
  try {
    await sendEmail({
      reciverEmail: email,
      subject: 'Password Reset Code',
      body: forgotPasswordEmailTemplate(resetCode),
    });
  } catch (error) {
    logger.error(`Failed to send password reset email: ${error}`);
    await redis.del(redisKey);
    throw new AppError(
      'Failed to send password reset email',
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
