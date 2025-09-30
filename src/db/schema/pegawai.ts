import { pgTable, serial, text } from 'drizzle-orm/pg-core';
// import { user } from './user';
// import { relations } from 'drizzle-orm';

export const pegawai = pgTable('pegawai', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
  jabatan: text('jabatan').notNull(),
  // userId: text('user_id')
  //   .notNull()
  //   .references(() => user.id, { onDelete: 'restrict' }),
});

// export const pegawaiRelations = relations(pegawai, ({ one }) => ({
//   user: one(user, {
//     fields: [pegawai.userId],
//     references: [user.id],
//   }),
// }));
