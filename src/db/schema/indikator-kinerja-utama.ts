import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { cascading, indikatorSasaran } from './cascading';
import { relations } from 'drizzle-orm';

export const indikatorKinerjaUtama = pgTable('indikator_kinerja_utama', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
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

export const indikatorKinerjaUtamaDetail = pgTable(
  'indikator_kinerja_utama_detail',
  {
    id: serial('id').primaryKey(),
    indikatorSasaranId: integer('sasaran_id')
      .notNull()
      .references(() => indikatorSasaran.id, { onDelete: 'restrict' }),
    baseline: jsonb('baseline').default({ type: 'doc', content: [] }),
    penjelasan: jsonb('penjelasan').default({ type: 'doc', content: [] }),
    penanggungJawab: jsonb('penanggung_jawab').default({
      type: 'doc',
      content: [],
    }),
    indikatorKinerjaUtamaId: integer('indikator_kinerja_utama_id')
      .notNull()
      .references(() => indikatorKinerjaUtama.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
);

export const indikatorKinerjaUtamaRelations = relations(
  indikatorKinerjaUtama,
  ({ one, many }) => ({
    cascading: one(cascading, {
      fields: [indikatorKinerjaUtama.cascadingId],
      references: [cascading.id],
    }),
    indikatorKinerjaUtamaDetailList: many(indikatorKinerjaUtamaDetail),
  }),
);

export const indikatorKinerjaUtamaDetailRelations = relations(
  indikatorKinerjaUtamaDetail,
  ({ one }) => ({
    indikatorKinerjaUtama: one(indikatorKinerjaUtama, {
      fields: [indikatorKinerjaUtamaDetail.indikatorKinerjaUtamaId],
      references: [indikatorKinerjaUtama.id],
    }),
    indikatorSasaran: one(indikatorSasaran, {
      fields: [indikatorKinerjaUtamaDetail.indikatorSasaranId],
      references: [indikatorSasaran.id],
    }),
  }),
);
