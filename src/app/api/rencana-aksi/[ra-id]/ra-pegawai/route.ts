import db from '@/db';
import { rencanaAksiPegawai } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'ra-id': string;
  }>;
}
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ra-id': raId } = await params;
    const records = await db.query.rencanaAksiPegawai.findMany({
      where: eq(rencanaAksiPegawai.rencanaAksiId, parseInt(raId)),
      with: {
        pegawai: true,
      },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'rencana_aksi_pegawai' records: ", error);
    return NextResponse.json({
      error: "Failed to fetch all 'rencana_aksi_pegawai' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ra-id': raId } = await params;
    const body = await request.json();
    const { tahun, pegawaiId, perjanjianKinerjaPegawaiId } = body;

    const newRecord = await db
      .insert(rencanaAksiPegawai)
      .values({
        tahun,
        pegawaiId,
        perjanjianKinerjaPegawaiId,
        rencanaAksiId: parseInt(raId),
      })
      .returning();
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'rencana_aksi_pegawai' record: ", error);
    return NextResponse.json({
      error: "Failed to create 'rencana_aksi_pegawai' record",
      status: 500,
    });
  }
}
