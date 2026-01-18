import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status';
import { prisma } from '@/utils/prismaClient';
import { AppError } from '@/utils/appError';
import sendEmail from '@/utils/sendEmail';
import { verifyEmailTemplate } from '@/templates/emailTemplates';
import { RegisterSchema } from './auth.dto';
import redis from '@/config/redis.config';

export const registerUserService = async (payload: RegisterSchema['body']) => {
  const { email, name, password, phone, address } = payload;

  // 1. Check existing user
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('User already exists', httpStatus.BAD_REQUEST);
  }

  // 2. Hash password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  // 3. Create user
  const user = await prisma.user.create({
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

  // 5. Store code in Redis (TTL = 60 seconds)
  const redisKey = `verify-email:${email}`;

  await redis.set(redisKey, verificationCode, 'EX', 60); // 60 seconds expiration

  // 6. Send email
  await sendEmail({
    reciverEmail: email,
    subject: 'Verify your email',
    body: verifyEmailTemplate(verificationCode),
  });

  // 7. Return the user data
  return user;
};
