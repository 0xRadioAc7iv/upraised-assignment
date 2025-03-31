import { Request } from 'express';
import { Schema } from 'joi';
import { JwtPayload } from 'jsonwebtoken';

export interface ValidationSchemas {
  body?: Schema;
  query?: Schema;
  params?: Schema;
}

export interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
  cookies: { [key: string]: string };
}
