import jwt from 'jsonwebtoken';
import { genJWTArgs } from '../lib/types';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from '../config';

export const generateJsonWebToken = ({ user, isAccess }: genJWTArgs) => {
  const jwtSecret = isAccess
    ? JWT_ACCESS_TOKEN_SECRET
    : JWT_REFRESH_TOKEN_SECRET;

  return jwt.sign(user, jwtSecret, {
    expiresIn: isAccess ? '15m' : '7d'
  });
};
