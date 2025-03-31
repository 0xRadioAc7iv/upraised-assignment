import { Router } from 'express';
import { testRouter } from './gadgets/routes';

const routerV1 = Router();

routerV1.use('/gadgets', testRouter);

export { routerV1 };
