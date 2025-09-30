import db from '@/db';
import {
  realisasiRencanaAksiPegawai,
  realisasiRencanaAksiPencapaianTarget,
  rencanaAksiPencapaianLangkah,
  rencanaAksiPencapaianTarget,
  satuan,
} from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { asc, eq } from 'drizzle-orm';
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
        realisasiRencanaAksiPencapaianTarget,
        rencanaAksiPencapaianTarget,
        rencanaAksiPencapaianLangkah,
        satuan,
      })
      .from(realisasiRencanaAksiPencapaianTarget)
      .where(
        eq(
          realisasiRencanaAksiPencapaianTarget.realisasiRencanaAksiPegawaiId,
          parseInt(rraPegawaiId),
        ),
      )
      .innerJoin(
        rencanaAksiPencapaianTarget,
        eq(
          realisasiRencanaAksiPencapaianTarget.rencanaAksiPencapaianTargetId,
          rencanaAksiPencapaianTarget.id,
        ),
      )
      .innerJoin(satuan, eq(rencanaAksiPencapaianTarget.satuanId, satuan.id))
      .innerJoin(
        rencanaAksiPencapaianLangkah,
        eq(
          rencanaAksiPencapaianTarget.rencanaAksiPencapaianLangkahId,
          rencanaAksiPencapaianLangkah.id,
        ),
      )
      .orderBy(asc(rencanaAksiPencapaianTarget.bulan));
    return NextResponse.json(records);
  } catch (error) {
    console.error(
      "Error fetching 'realisasi_rencana_aksi_pencapaian_target' records: ",
      error,
    );
    return NextResponse.json(
      { error: "'realisasi_rencana_aksi_pencapaian_target' record not found" },
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
    const { realisasi, capaian, rencanaAksiPencapaianTargetId } = body;

    const newRecord = await db
      .insert(realisasiRencanaAksiPencapaianTarget)
      .values({
        realisasi,
        capaian,
        rencanaAksiPencapaianTargetId,
        realisasiRencanaAksiPegawaiId: parseInt(rraPegawaiId),
      })
      .returning();

    await db
      .update(realisasiRencanaAksiPegawai)
      .set({ updatedAt: new Date() })
      .where(eq(realisasiRencanaAksiPegawai.id, parseInt(rraPegawaiId)));

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error(
      "Error creating 'realisasi_rencana_aksi_pencapaian_target' record: ",
      error,
    );
    return NextResponse.json(
      {
        error:
          "Failed to create 'realisasi_rencana_aksi_pencapaian_target' record",
      },
      { status: 404 },
    );
  }
}
