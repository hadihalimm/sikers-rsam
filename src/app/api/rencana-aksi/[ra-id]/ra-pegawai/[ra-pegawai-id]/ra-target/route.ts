import db from '@/db';
import { rencanaAksiTarget } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
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
    const records = await db.query.rencanaAksiTarget.findMany({
      where: eq(rencanaAksiTarget.rencanaAksiPegawaiId, parseInt(raPegawaiId)),
      orderBy: [asc(rencanaAksiTarget.bulan)],
      with: {
        perjanjianKinerjaPegawaiSasaran: {
          with: {
            satuan: true,
          },
        },
      },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'rencana_aksi_target' records: ", error);
    return NextResponse.json({
      error: "Failed to fetch all 'rencana_aksi_target' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ra-pegawai-id': raPegawaiId } = await params;
    const body = await request.json();
    const { target, bulan, pkPegawaiSasaranId } = body;

    const newRecord = await db
      .insert(rencanaAksiTarget)
      .values({
        bulan,
        target,
        perjanjianKinerjaPegawaiSasaranId: pkPegawaiSasaranId,
        rencanaAksiPegawaiId: parseInt(raPegawaiId),
      })
      .returning();
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'rencana_aksi_target' record: ", error);
    return NextResponse.json({
      error: "Failed to create 'rencana_aksi_target' record",
      status: 500,
    });
  }
}
