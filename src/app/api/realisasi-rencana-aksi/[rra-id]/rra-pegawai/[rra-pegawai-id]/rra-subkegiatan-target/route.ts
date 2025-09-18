import db from '@/db';
import {
  perjanjianKinerjaPegawaiProgram,
  realisasiRencanaAksiSubkegiatanTarget,
  refKegiatan,
  refProgram,
  refSubKegiatan,
  rencanaAksiSubKegiatanTarget,
  satuan,
} from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'rra-id': string;
    'rra-pegawai-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { 'rra-pegawai-id': rraPegawaiId } = await params;
    const records = await db
      .select({
        realisasiRencanaAksiSubkegiatanTarget,
        rencanaAksiSubKegiatanTarget,
        satuan,
        perjanjianKinerjaPegawaiProgram,
        refProgram,
        refKegiatan,
        refSubKegiatan,
      })
      .from(realisasiRencanaAksiSubkegiatanTarget)
      .where(
        eq(
          realisasiRencanaAksiSubkegiatanTarget.realisasiRencanaAksiPegawaiId,
          parseInt(rraPegawaiId),
        ),
      )
      .innerJoin(
        rencanaAksiSubKegiatanTarget,
        eq(
          realisasiRencanaAksiSubkegiatanTarget.rencanaAksiSubKegiatanTargetId,
          rencanaAksiSubKegiatanTarget.id,
        ),
      )
      .innerJoin(satuan, eq(rencanaAksiSubKegiatanTarget.satuanId, satuan.id))
      .innerJoin(
        perjanjianKinerjaPegawaiProgram,
        eq(
          rencanaAksiSubKegiatanTarget.perjanjianKinerjaPegawaiProgramId,
          perjanjianKinerjaPegawaiProgram.id,
        ),
      )
      .innerJoin(
        refSubKegiatan,
        eq(perjanjianKinerjaPegawaiProgram.subKegiatanId, refSubKegiatan.id),
      )
      .innerJoin(refKegiatan, eq(refSubKegiatan.refKegiatanId, refKegiatan.id))
      .innerJoin(refProgram, eq(refKegiatan.refProgramId, refProgram.id));
    return NextResponse.json(records);
  } catch (error) {
    console.error(
      "Error fetching 'realisasi_rencana_aksi_subkegiatan_target' records: ",
      error,
    );
    return NextResponse.json(
      { error: "'realisasi_rencana_aksi_subkegiatan_target' record not found" },
      { status: 404 },
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { 'rra-pegawai-id': rraPegawaiId } = await params;
    const body = await request.json();
    const { realisasi, realisasiAnggaran, rencanaAksiSubKegiatanTargetId } =
      body;

    const newRecord = await db
      .insert(realisasiRencanaAksiSubkegiatanTarget)
      .values({
        realisasi,
        realisasiAnggaran,
        rencanaAksiSubKegiatanTargetId,
        realisasiRencanaAksiPegawaiId: parseInt(rraPegawaiId),
      })
      .returning();
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error(
      "Error creating 'realisasi_rencana_aksi_subkegiatan_target' record: ",
      error,
    );
    return NextResponse.json(
      {
        error:
          "Failed to create 'realisasi_rencana_aksi_subkegiatan_target' record",
      },
      { status: 404 },
    );
  }
}
