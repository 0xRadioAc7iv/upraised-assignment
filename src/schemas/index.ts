import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import Joi from 'joi';

const signUpBodySchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

const gadgetsStatusEnum = pgEnum('gadgets_status', [
  'Available',
  'Deployed',
  'Destroyed',
  'Decommissioned'
]);

const users = pgTable('users', {
  id: uuid().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull()
});

const refreshTokens = pgTable('refreshTokens', {
  user_id: uuid()
    .references(() => users.id)
    .notNull(),
  token: text('token').notNull()
});

const gadgets = pgTable('gadgets', {
  id: uuid().primaryKey(),
  name: text('name').notNull(),
  status: gadgetsStatusEnum('status').notNull(),
  decommissioned_timestamp: timestamp('decommissioned_timestamp')
});

export { users, gadgets, refreshTokens, signUpBodySchema };
