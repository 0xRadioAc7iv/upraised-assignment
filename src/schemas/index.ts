import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

const gadgetsStatusEnum = pgEnum('gadgets_status', [
  'Available',
  'Deployed',
  'Destroyed',
  'Decommissioned'
]);

export const gadgets = pgTable('gadgets', {
  id: uuid().primaryKey(),
  name: text('name').notNull(),
  status: gadgetsStatusEnum('status').notNull(),
  decommissioned_timestamp: timestamp()
});
