import { Router } from 'express';
import {
  checkAuthStatusController,
  logoutController,
  refreshAccessTokenController,
  signinController,
  signupController
} from '../../../controllers/authControllers';
import { authMiddleware } from '../../../middlewares/auth';
import { validateRequest } from '../../../middlewares/requestValidator';
import { signUpBodySchema } from '../../../schemas';

const authRouter = Router();

/**
 * @swagger
 * /auth/check:
 *   post:
 *     summary: Check authentication status
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User is authenticated
 */
authRouter.post('/check', authMiddleware, checkAuthStatusController);

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email is already in use
 */
authRouter.post(
  '/signup',
  validateRequest({
    body: signUpBodySchema
  }),
  signupController
);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Sign in an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed in successfully
 *       401:
 *         description: Invalid email or password
 */
authRouter.post(
  '/signin',
  validateRequest({
    body: signUpBodySchema
  }),
  signinController
);

/**
 * @swagger
 * /auth/token:
 *   post:
 *     summary: Refresh access token
 *     responses:
 *       200:
 *         description: New access token issued
 *       400:
 *         description: Refresh token is required
 *       403:
 *         description: Invalid refresh token
 */
authRouter.post('/token', refreshAccessTokenController);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the user and clear tokens
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Successfully logged out
 *       400:
 *         description: Refresh token is required
 */
authRouter.post('/logout', authMiddleware, logoutController);

export { authRouter };
