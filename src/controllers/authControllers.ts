import { RequestHandler } from 'express';
import { compare } from 'bcrypt';
import { hashPassword } from '../utils/hashing';
import jwt from 'jsonwebtoken';
import { db } from '../utils/db';
import { refreshTokens, users } from '../schemas';
import { eq, sql } from 'drizzle-orm';
import { generateJsonWebToken } from '../utils/auth';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from '../config';

const checkAuthStatusController: RequestHandler = async (
  _request,
  response
) => {
  response.sendStatus(200);
};

const signupController: RequestHandler = async (request, response, next) => {
  const { email, password } = request.body;

  try {
    const result = await db.select().from(users).where(eq(users.email, email));

    if (result.length > 0) {
      response.status(409).json({ message: 'Email is already in use!' });
      return;
    }

    const hashedPassword = await hashPassword(password);
    await db.insert(users).values({
      id: sql`uuid_generate_v4()`,
      email: email,
      password: hashedPassword
    });
    response.sendStatus(201);
  } catch (error) {
    next(error);
  }
};

const signinController: RequestHandler = async (request, response, next) => {
  const { email, password } = request.body;

  try {
    const result = await db.select().from(users).where(eq(users.email, email));

    if (result.length == 0) {
      response.status(401).json({ message: 'Invalid Email' });
      return;
    }

    const user = result[0];
    const isPasswordMatch = await compare(password, user.password);

    if (!isPasswordMatch) {
      response.status(401).json({ message: 'Invalid Password' });
      return;
    }

    const payload = {
      id: user.id,
      email: user.email
    };

    const accessToken = generateJsonWebToken({ user: payload, isAccess: true });
    const refreshToken = generateJsonWebToken({
      user: payload,
      isAccess: false
    });

    await db
      .insert(refreshTokens)
      .values({ user_id: user.id, token: refreshToken });

    response
      .cookie('access', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      })
      .cookie('refresh', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const refreshAccessTokenController: RequestHandler = async (
  request,
  response,
  next
) => {
  const refreshToken = request.cookies['refresh'];

  if (!refreshToken) {
    response.status(400).json({ message: 'Refresh token is required' });
    return;
  }

  try {
    const result = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, refreshToken));

    if (result.length === 0) {
      response.status(403).json({ message: 'Invalid refresh token' });
      return;
    }

    jwt.verify(
      refreshToken,
      JWT_REFRESH_TOKEN_SECRET,
      (err: any, decoded: any) => {
        if (err) {
          response.status(403).json({ message: 'Invalid refresh token' });
          return;
        }

        const newAccessToken = jwt.sign(
          { id: decoded.id, email: decoded.email },
          JWT_ACCESS_TOKEN_SECRET as string,
          { expiresIn: '15m' }
        );

        response
          .cookie('access', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
          })
          .sendStatus(200);
      }
    );
  } catch (error) {
    next(error);
  }
};

const logoutController: RequestHandler = async (request, response, next) => {
  const refreshToken = request.cookies['refresh'];

  if (!refreshToken) {
    response.status(400).send({ error: 'Refresh token is required.' });
    return;
  }

  try {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));
    response.clearCookie('access').clearCookie('refresh').sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export {
  checkAuthStatusController,
  signupController,
  signinController,
  refreshAccessTokenController,
  logoutController
};
