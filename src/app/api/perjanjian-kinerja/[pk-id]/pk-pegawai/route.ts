import db from '@/db';
import {
  perjanjianKinerjaPegawai,
  realisasiRencanaAksi,
  realisasiRencanaAksiPegawai,
  rencanaAksi,
  rencanaAksiPegawai,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'pk-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'pk-id': pkId } = await params;
    const records = await db.query.perjanjianKinerjaPegawai.findMany({
      where: eq(perjanjianKinerjaPegawai.perjanjianKinerjaId, parseInt(pkId)),
      with: {
        pegawai: true,
      },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error(
      "Error fetching 'perjanjian_kinerja_pegawai' records: ",
      error,
    );
    return NextResponse.json({
      error: "Failed to fetch all 'perjanjian_kinerja_pegawai' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'pk-id': pkId } = await params;
    const body = await request.json();
    const { tahun, pegawaiId } = body;
    const newRecord = await db
      .insert(perjanjianKinerjaPegawai)
      .values({ tahun, pegawaiId, perjanjianKinerjaId: parseInt(pkId) })
      .returning();

    const rencanaAksiRecord = await db.query.rencanaAksi.findFirst({
      where: eq(rencanaAksi.perjanjianKinerjaId, parseInt(pkId)),
    });
    if (!rencanaAksiRecord) {
      throw new Error('rencanaAksi not found for this perjanjianKinerja');
    }
    const newRaPegawai = await db
      .insert(rencanaAksiPegawai)
      .values({
        tahun,
        pegawaiId,
        rencanaAksiId: rencanaAksiRecord.id,
        perjanjianKinerjaPegawaiId: newRecord[0].id,
      })
      .returning();

    const realisasiRencanaAksiRecord =
      await db.query.realisasiRencanaAksi.findFirst({
        where: eq(realisasiRencanaAksi.rencanaAksiId, rencanaAksiRecord.id),
      });
    console.log(realisasiRencanaAksiRecord);
    if (!realisasiRencanaAksiRecord) {
      throw new Error(
        'realisasiRencanaAksiPegawai not found for this rencanaAksiPegawai',
      );
    }

    await db.insert(realisasiRencanaAksiPegawai).values({
      tahun,
      pegawaiId,
      realisasiRencanaAksiId: realisasiRencanaAksiRecord.id,
      rencanaAksiPegawaiId: newRaPegawai[0].id,
    });
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error(
      "Error creating 'perjanjian_kinerja_pegawai' record: ",
      error,
    );
    return NextResponse.json({
      error: "Failed to create 'perjanjian_kinerja_pegawai' record",
      status: 500,
    });
  }
}
