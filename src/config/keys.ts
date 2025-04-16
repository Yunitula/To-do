import { SetMetadata } from '@nestjs/common';
import { jwtSecretKey } from './config';

export const IS_PUBLIC_KEY = 'isPublic';

export const Private = jwtSecretKey;

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Time = process.env.ACCESS_SECRET_KEY_EXPIRE_TIME;
