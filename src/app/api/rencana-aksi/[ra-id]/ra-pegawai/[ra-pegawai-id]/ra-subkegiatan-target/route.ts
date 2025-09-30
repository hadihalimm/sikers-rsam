import db from '@/db';
import {
  realisasiRencanaAksiPegawai,
  realisasiRencanaAksiSubkegiatanTarget,
  rencanaAksiSubKegiatanTarget,
} from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'ra-id': string;
    'ra-pegawai-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { 'ra-pegawai-id': raPegawaiId } = await params;
    const records = await db.query.rencanaAksiSubKegiatanTarget.findMany({
      where: eq(
        rencanaAksiSubKegiatanTarget.rencanaAksiPegawaiId,
        parseInt(raPegawaiId),
      ),
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error(
      "Error fetching 'rencana_aksi_subkegiatan_target' records: ",
      error,
    );
    return NextResponse.json({
      error: "Failed to fetch all 'rencana_aksi_subkegiatan_target' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { 'ra-pegawai-id': raPegawaiId } = await params;
    const body = await request.json();
    const { nama, target, satuanId, pkPegawaiProgramId } = body;

    const newRecord = await db
      .insert(rencanaAksiSubKegiatanTarget)
      .values({
        nama,
        target,
        satuanId,
        perjanjianKinerjaPegawaiProgramId: pkPegawaiProgramId,
        rencanaAksiPegawaiId: parseInt(raPegawaiId),
      })
      .returning();

    const rraPegawai = await db.query.realisasiRencanaAksiPegawai.findFirst({
      where: eq(
        realisasiRencanaAksiPegawai.rencanaAksiPegawaiId,
        parseInt(raPegawaiId),
      ),
    });
    if (!rraPegawai)
      throw new Error(
        'realisasiRencanaAksiPegawai not found for this rencanaAksiPegawaiId',
      );

    await db.insert(realisasiRencanaAksiSubkegiatanTarget).values({
      rencanaAksiSubKegiatanTargetId: newRecord[0].id,
      realisasiRencanaAksiPegawaiId: rraPegawai.id,
    });
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error(
      "Error creating 'rencana_aksi_subkegiatan_target' record: ",
      error,
    );
    return NextResponse.json({
      error: "Failed to create 'rencana_aksi_subkegiatan_target' record",
      status: 500,
    });
  }
}
