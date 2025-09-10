import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const satuan = pgTable('satuan', {
  id: serial('id').primaryKey(),
  nama: text('name').notNull().unique(),
});
