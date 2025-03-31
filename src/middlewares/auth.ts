import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../lib/interfaces';
import { JWT_ACCESS_TOKEN_SECRET } from '../config';

export const authMiddleware = (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) => {
  const accessToken = request.cookies['access'];

  if (!accessToken) {
    response.sendStatus(401);
    return;
  }

  jwt.verify(
    accessToken,
    JWT_ACCESS_TOKEN_SECRET,
    (err: any, user: string | jwt.JwtPayload | undefined) => {
      if (err) return response.sendStatus(403);
      request.user = user;
      next();
    }
  );
};
