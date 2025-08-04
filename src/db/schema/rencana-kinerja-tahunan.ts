import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { cascading, indikatorSasaran } from './cascading';
import { relations } from 'drizzle-orm';

export const rencanaKinerjaTahunan = pgTable('rencana_kinerja_tahunan', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
  tahun: integer('tahun').notNull(),
  cascadingId: integer('cascading_id')
    .notNull()
    .references(() => cascading.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const rencanaKinerjaTahunanDetail = pgTable(
  'rencana_kinerja_tahunan_detail',
  {
    id: serial('id').primaryKey(),
    target: text('target').notNull(),
    rencanaKinerjaTahunanId: integer('rencana_kinerja_tahunan_id')
      .notNull()
      .references(() => indikatorSasaran.id, { onDelete: 'restrict' }),
    indikatorSasaranId: integer('sasaran_id')
      .notNull()
      .references(() => indikatorSasaran.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
);

export const rencanaKinerjaTahunanRelations = relations(
  rencanaKinerjaTahunan,
  ({ one, many }) => ({
    cascading: one(cascading, {
      fields: [rencanaKinerjaTahunan.cascadingId],
      references: [cascading.id],
    }),
    rencanaKinerjaTahunanDetail: many(rencanaKinerjaTahunanDetail),
  }),
);

export const rencanaKinerjaTahunanDetailRelations = relations(
  rencanaKinerjaTahunanDetail,
  ({ one }) => ({
    rencanaKinerjaTahunan: one(rencanaKinerjaTahunan, {
      fields: [rencanaKinerjaTahunanDetail.rencanaKinerjaTahunanId],
      references: [rencanaKinerjaTahunan.id],
    }),
  }),
);
