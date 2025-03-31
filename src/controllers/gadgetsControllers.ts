import { RequestHandler } from 'express';
import { db } from '../utils/db';
import { gadgets } from '../schemas';
import { eq, sql } from 'drizzle-orm';

const validStatuses = [
  'Available',
  'Deployed',
  'Destroyed',
  'Decommissioned'
] as const;

const randomNames = [
  'Smartwatch X Pro',
  'Noise-Canceling Headphones Max',
  'Portable Bluetooth Speaker Mini',
  'Wireless Charging Pad Duo',
  'Fitness Tracker Elite',
  'Smart Home Hub Essential',
  'VR Headset Immersive',
  'Drone Explorer 4K',
  'Electric Scooter Urban',
  'Digital Camera Zoom Pro'
];

const retrieveGadgetsController: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    const { status } = request.query;

    const typedStatus = validStatuses.find((s) => s === status) as
      | (typeof validStatuses)[number]
      | undefined;

    let results;

    if (status) {
      if (typedStatus) {
        results = await db
          .select()
          .from(gadgets)
          .where(eq(gadgets.status, typedStatus));
      } else {
        response.status(401).json({ error: 'Invalid Status' });
        return;
      }
    } else {
      results = await db.select().from(gadgets);
    }

    const gadgetsWithProbability = results.map((gadget) => ({
      ...gadget,
      missionSuccessProbability: `${Math.floor(Math.random() * 51) + 50}%`
    }));

    response.status(200).json(gadgetsWithProbability);
  } catch (error) {
    next(error);
  }
};

const selfDestructGadgetController: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    const { id } = request.params;

    if (!id) {
      response.status(401).json({ error: 'ID Required' });
      return;
    }

    // Simulating Random Generated Code
    const code = Math.floor(Math.random() * 1000000);

    // Simulating Invalid Code
    if (code < 300000) {
      response.sendStatus(401);
      return;
    }

    // Send Status Code 200, if Valid
    response.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const createNewGadgetController: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    const randomName =
      randomNames[Math.floor(Math.random() * randomNames.length)];

    const [newGadget] = await db
      .insert(gadgets)
      .values({
        id: sql`uuid_generate_v4()`,
        name: randomName,
        status: 'Available'
      })
      .returning();

    response.status(201).json(newGadget);
  } catch (error) {
    next(error);
  }
};

const updateGadgetController: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    const { id } = request.params;

    if (!id) {
      response.status(401).json({ error: 'ID Required' });
      return;
    }

    const results = await db.select().from(gadgets).where(eq(gadgets.id, id));

    if (results.length === 0) {
      response.status(404).send({ error: 'Gadget with given ID not found' });
      return;
    }

    const { name, status } = request.body;

    if (!name || !status) {
      response.status(401).send({ error: 'Missing Data' });
      return;
    }

    /* eslint-disable */
    if (!validStatuses.includes(status as any)) {
      response.status(400).json({ error: 'Invalid Status Value' });
      return;
    }

    const updateData: Record<string, any> = { name, status };
    /* eslint-enable */

    if (status === 'Decommissioned') {
      updateData.decommissioned_timestamp = sql`NOW()`;
    }

    await db.update(gadgets).set(updateData).where(eq(gadgets.id, id));

    response.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const deleteGadgetController: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    const { id } = request.params;

    if (!id) {
      response.status(401).json({ error: 'ID Required' });
      return;
    }

    const results = await db.select().from(gadgets).where(eq(gadgets.id, id));

    if (results.length === 0) {
      response.status(404).send({ error: 'Gadget with given ID not found' });
      return;
    }

    await db
      .update(gadgets)
      .set({ status: 'Decommissioned', decommissioned_timestamp: sql`NOW()` })
      .where(eq(gadgets.id, id));

    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export {
  retrieveGadgetsController,
  selfDestructGadgetController,
  createNewGadgetController,
  updateGadgetController,
  deleteGadgetController
};
