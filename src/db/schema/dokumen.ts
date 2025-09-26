import {
  customType,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
  dataType() {
    return 'bytea';
  },
  fromDriver(value: unknown): Buffer {
    if (value instanceof Buffer) {
      return value;
    }
    if (typeof value === 'string') {
      const hexString = value.startsWith('\\x') ? value.slice(2) : value;
      return Buffer.from(hexString, 'hex');
    }
    throw new Error(`Cannot convert type: ${typeof value} to buffer`);
  },
  toDriver(value: unknown): Buffer {
    return value as Buffer;
  },
});

export const dokumenEvaluasi = pgTable('dokumen_evaluasi', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
  file: bytea('file'),
  fileName: text('file_name').notNull(),
  mimeType: text('mime_type'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const dokumenLakip = pgTable('dokumen_lakip', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
  file: bytea('file'),
  fileName: text('file_name').notNull(),
  mimeType: text('mime_type'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
