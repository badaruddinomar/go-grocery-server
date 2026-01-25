import { User } from '@/generated/prisma';

export type UserWithoutPassword = Omit<User, 'password'>;

export interface UserLoginServiceResult {
  user: UserWithoutPassword;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenServiceResult {
  accessToken: string;
  refreshToken: string;
}
