import { Router } from 'express';
import {
  createNewGadgetController,
  deleteGadgetController,
  retrieveGadgetsController,
  selfDestructGadgetController,
  updateGadgetController
} from '../../../controllers/gadgetsControllers';

const testRouter = Router();

testRouter.get('/', retrieveGadgetsController);

testRouter.post('/:id/self-destruct', selfDestructGadgetController);

testRouter.post('/', createNewGadgetController);

testRouter.patch('/:id', updateGadgetController);

testRouter.delete('/:id', deleteGadgetController);

export { testRouter };
