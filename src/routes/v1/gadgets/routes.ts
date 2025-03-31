import { Router } from 'express';
import {
  createNewGadgetController,
  deleteGadgetController,
  retrieveGadgetsController,
  selfDestructGadgetController,
  updateGadgetController
} from '../../../controllers/gadgetsControllers';

const gadgetsRouter = Router();

gadgetsRouter.get('/', retrieveGadgetsController);

gadgetsRouter.post('/:id/self-destruct', selfDestructGadgetController);

gadgetsRouter.post('/', createNewGadgetController);

gadgetsRouter.patch('/:id', updateGadgetController);

gadgetsRouter.delete('/:id', deleteGadgetController);

export { gadgetsRouter };
