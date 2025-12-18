import 'dotenv/config';
import db from '.';
import dataPegawai from './data-pegawai.json';
import { pegawai } from './schema';

async function main() {
  await db.insert(pegawai).values(dataPegawai);
  console.log(`✅ Inserted ${dataPegawai.length} pegawai`);
}

main().catch((err) => {
  console.error('❌ Failed to insert pegawai', err);
  process.exit(1);
});
