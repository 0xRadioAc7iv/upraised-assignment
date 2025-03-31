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

authRouter.post('/check', authMiddleware, checkAuthStatusController);

authRouter.post(
  '/signup',
  validateRequest({
    body: signUpBodySchema
  }),
  signupController
);

authRouter.post(
  '/signin',
  validateRequest({
    body: signUpBodySchema
  }),
  signinController
);

authRouter.post('/token', refreshAccessTokenController);

authRouter.post('/logout', authMiddleware, logoutController);

export { authRouter };
