import { Router } from 'express';
import {
  createNewGadgetController,
  deleteGadgetController,
  retrieveGadgetsController,
  selfDestructGadgetController,
  updateGadgetController
} from '../../../controllers/gadgetsControllers';

const gadgetsRouter = Router();

/**
 * @swagger
 * /gadgets:
 *   get:
 *     summary: Retrieve a list of gadgets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter gadgets by status
 *     responses:
 *       200:
 *         description: A list of gadgets with mission success probability
 *       401:
 *         description: Invalid Status
 */
gadgetsRouter.get('/', retrieveGadgetsController);

/**
 * @swagger
 * /gadgets/{id}/self-destruct:
 *   post:
 *     summary: Initiates self-destruction of a gadget
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The gadget ID
 *     responses:
 *       200:
 *         description: Self-destruct sequence initiated
 *       401:
 *         description: Unauthorized or Invalid Code
 */
gadgetsRouter.post('/:id/self-destruct', selfDestructGadgetController);

/**
 * @swagger
 * /gadgets:
 *   post:
 *     summary: Create a new gadget with a random name
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: New gadget created successfully
 *       500:
 *         description: Server error
 */
gadgetsRouter.post('/', createNewGadgetController);

/**
 * @swagger
 * /gadgets/{id}:
 *   patch:
 *     summary: Update an existing gadget
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The gadget ID
 *       - in: body
 *         name: body
 *         description: Gadget data to update
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             status:
 *               type: string
 *     responses:
 *       200:
 *         description: Gadget updated successfully
 *       400:
 *         description: Invalid status value
 *       401:
 *         description: Missing data
 *       404:
 *         description: Gadget not found
 */
gadgetsRouter.patch('/:id', updateGadgetController);

/**
 * @swagger
 * /gadgets/{id}:
 *   delete:
 *     summary: Decommission a gadget
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The gadget ID
 *     responses:
 *       204:
 *         description: Gadget decommissioned successfully
 *       401:
 *         description: ID Required
 *       404:
 *         description: Gadget not found
 */
gadgetsRouter.delete('/:id', deleteGadgetController);

export { gadgetsRouter };
