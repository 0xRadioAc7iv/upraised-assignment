import { Router } from 'express';
import { gadgetsRouter } from './gadgets/routes';
import { authRouter } from './auth/routes';
import { authMiddleware } from '../../middlewares/auth';

const routerV1 = Router();

routerV1.use('/gadgets', authMiddleware, gadgetsRouter);
routerV1.use('/auth', authRouter);

export { routerV1 };
