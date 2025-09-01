import db from '@/db';
import { rencanaAksiSubKegiatanTarget } from '@/db/schema';
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
    const { 'ra-pegawai-id': raPegawaiId } = await params;
    const body = await request.json();
    const { target, satuan, pkPegawaiProgramId } = body;

    const newRecord = await db
      .insert(rencanaAksiSubKegiatanTarget)
      .values({
        target,
        satuan,
        perjanjianKinerjaPegawaiProgramId: pkPegawaiProgramId,
        rencanaAksiPegawaiId: parseInt(raPegawaiId),
      })
      .returning();
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
