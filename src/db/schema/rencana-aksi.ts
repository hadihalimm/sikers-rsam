import {
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { user } from './user';
import { pegawai } from './pegawai';
import {
  perjanjianKinerjaPegawai,
  perjanjianKinerjaPegawaiProgram,
  perjanjianKinerjaPegawaiSasaran,
} from './perjanjian-kinerja';
import { relations } from 'drizzle-orm';

export const rencanaAksi = pgTable('rencana_aksi', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
  tahun: integer('tahun').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'restrict' }),
});

export const rencanaAksiPegawai = pgTable('rencana_aksi_pegawai', {
  id: serial('id').primaryKey(),
  tahun: integer('tahun').notNull(),
  pegawaiId: integer('pegawai_id')
    .notNull()
    .references(() => pegawai.id, { onDelete: 'restrict' }),
  rencanaAksiId: integer('rencana_aksi_id')
    .notNull()
    .references(() => rencanaAksi.id, { onDelete: 'restrict' }),
  perjanjianKinerjaPegawaiId: integer('perjanjian_kinerja_pegawai_id')
    .notNull()
    .references(() => perjanjianKinerjaPegawai.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const rencanaAksiTarget = pgTable('rencana_aksi_target', {
  id: serial('id').primaryKey(),
  bulan: integer('bulan').notNull(),
  target: numeric(),
  rencanaAksiPegawaiId: integer('rencana_aksi_pegawai_id')
    .notNull()
    .references(() => rencanaAksiPegawai.id, {
      onDelete: 'cascade',
    }),
  perjanjianKinerjaPegawaiSasaranId: integer(
    'perjanjian_kinerja_pegawai_sasaran_id',
  )
    .notNull()
    .references(() => perjanjianKinerjaPegawaiSasaran.id, {
      onDelete: 'cascade',
    }),
});

export const rencanaAksiPencapaianLangkah = pgTable(
  'rencana_aksi_pencapaian_langkah',
  {
    id: serial('id').primaryKey(),
    nama: text().notNull(),
    rencanaAksiPegawaiId: integer('rencana_aksi_pegawai_id')
      .notNull()
      .references(() => rencanaAksiPegawai.id, {
        onDelete: 'cascade',
      }),
    perjanjianKinerjaPegawaiSasaranId: integer(
      'perjanjian_kinerja_pegawai_sasaran_id',
    )
      .notNull()
      .references(() => perjanjianKinerjaPegawaiSasaran.id, {
        onDelete: 'cascade',
      }),
  },
);

export const rencanaAksiPencapaianTarget = pgTable(
  'rencana_aksi_pencapaian_target',
  {
    id: serial('id').primaryKey(),
    target: text().notNull(),
    rencanaAksiPencapaianLangkahId: integer(
      'rencana_aksi_langkah_pencapaian_id',
    )
      .notNull()
      .references(() => rencanaAksiPencapaianLangkah.id, {
        onDelete: 'cascade',
      }),
  },
);

export const rencanaAksiSubKegiatanTarget = pgTable(
  'rencana_aksi_subkegiatan_target',
  {
    id: serial('id').primaryKey(),
    target: numeric(),
    satuan: text(),
    rencanaAksiPegawaiId: integer('rencana_aksi_pegawai_id')
      .notNull()
      .references(() => rencanaAksiPegawai.id, {
        onDelete: 'cascade',
      }),
    perjanjianKinerjaPegawaiProgramId: integer(
      'perjanjian_kinerja_pegawai_program_id',
    )
      .notNull()
      .references(() => perjanjianKinerjaPegawaiProgram.id, {
        onDelete: 'cascade',
      }),
  },
);

export const rencanaAksiRelations = relations(rencanaAksi, ({ one, many }) => ({
  user: one(user, {
    fields: [rencanaAksi.userId],
    references: [user.id],
  }),
  rencanaAksiPegawaiList: many(rencanaAksiPegawai),
}));

export const rencanaAksiPegawaiRelations = relations(
  rencanaAksiPegawai,
  ({ one, many }) => ({
    pegawai: one(pegawai, {
      fields: [rencanaAksiPegawai.pegawaiId],
      references: [pegawai.id],
    }),
    rencanaAksi: one(rencanaAksi, {
      fields: [rencanaAksiPegawai.rencanaAksiId],
      references: [rencanaAksi.id],
    }),
    perjanjianKinerjaPegawai: one(perjanjianKinerjaPegawai, {
      fields: [rencanaAksiPegawai.perjanjianKinerjaPegawaiId],
      references: [perjanjianKinerjaPegawai.id],
    }),
    rencanaAksiTargetList: many(rencanaAksiTarget),
    rencanaAksiPencapaianLangkahList: many(rencanaAksiPencapaianLangkah),
  }),
);

export const rencanaAksiTargetRelations = relations(
  rencanaAksiTarget,
  ({ one }) => ({
    rencanaAksiPegawai: one(rencanaAksiPegawai, {
      fields: [rencanaAksiTarget.rencanaAksiPegawaiId],
      references: [rencanaAksiPegawai.id],
    }),
    perjanjianKinerjaPegawaiSasaran: one(perjanjianKinerjaPegawaiSasaran, {
      fields: [rencanaAksiTarget.perjanjianKinerjaPegawaiSasaranId],
      references: [perjanjianKinerjaPegawaiSasaran.id],
    }),
  }),
);

export const rencanaAksiPencapaianLangkahRelations = relations(
  rencanaAksiPencapaianLangkah,
  ({ one, many }) => ({
    rencanaAksiPegawai: one(rencanaAksiPegawai, {
      fields: [rencanaAksiPencapaianLangkah.rencanaAksiPegawaiId],
      references: [rencanaAksiPegawai.id],
    }),
    perjanjianKinerjaPegawaiSasaran: one(perjanjianKinerjaPegawaiSasaran, {
      fields: [rencanaAksiPencapaianLangkah.perjanjianKinerjaPegawaiSasaranId],
      references: [perjanjianKinerjaPegawaiSasaran.id],
    }),
    rencanaAksiPencapaianTargetList: many(rencanaAksiPencapaianTarget),
  }),
);

export const rencanaAksiPencapaianTargetRelations = relations(
  rencanaAksiPencapaianTarget,
  ({ one }) => ({
    rencanaAksiPencapaianLangkah: one(rencanaAksiPencapaianLangkah, {
      fields: [rencanaAksiPencapaianTarget.rencanaAksiPencapaianLangkahId],
      references: [rencanaAksiPencapaianLangkah.id],
    }),
  }),
);

export const rencanaAksiSubKegiatanTargetRelations = relations(
  rencanaAksiSubKegiatanTarget,
  ({ one }) => ({
    rencanaAksiPegawai: one(rencanaAksiPegawai, {
      fields: [rencanaAksiSubKegiatanTarget.rencanaAksiPegawaiId],
      references: [rencanaAksiPegawai.id],
    }),
    perjanjianKinerjaPegawaiProgram: one(perjanjianKinerjaPegawaiProgram, {
      fields: [rencanaAksiSubKegiatanTarget.perjanjianKinerjaPegawaiProgramId],
      references: [perjanjianKinerjaPegawaiProgram.id],
    }),
  }),
);
