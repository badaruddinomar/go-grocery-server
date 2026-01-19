import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status';
import { prisma } from '@/utils/prismaClient';
import { AppError } from '@/utils/appError';
import sendEmail from '@/utils/sendEmail';
import { verifyEmailTemplate } from '@/templates/emailTemplates';
import { RegisterSchema } from './auth.dto';
import redis from '@/config/redis.config';
import logger from '@/utils/logger';

// Service to handle user registration
export const registerUserService = async (payload: RegisterSchema['body']) => {
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
export const verifyEmailService = async (email: string, code: string) => {
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
