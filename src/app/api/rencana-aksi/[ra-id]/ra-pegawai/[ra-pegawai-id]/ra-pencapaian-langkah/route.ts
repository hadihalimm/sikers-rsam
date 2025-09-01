import db from '@/db';
import { rencanaAksiPencapaianLangkah } from '@/db/schema';
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
    const records = await db.query.rencanaAksiPencapaianLangkah.findMany({
      where: eq(
        rencanaAksiPencapaianLangkah.rencanaAksiPegawaiId,
        parseInt(raPegawaiId),
      ),
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error(
      "Error fetching 'rencana_aksi_pencapaian_langkah' records: ",
      error,
    );
    return NextResponse.json({
      error: "Failed to fetch all 'rencana_aksi_pencapaian_langkah' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ra-pegawai-id': raPegawaiId } = await params;
    const body = await request.json();
    const { nama, pkPegawaiSasaranId } = body;

    const newRecord = await db
      .insert(rencanaAksiPencapaianLangkah)
      .values({
        nama,
        perjanjianKinerjaPegawaiSasaranId: pkPegawaiSasaranId,
        rencanaAksiPegawaiId: parseInt(raPegawaiId),
      })
      .returning();
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error(
      "Error creating 'rencana_aksi_pencapaian_langkah' record: ",
      error,
    );
    return NextResponse.json({
      error: "Failed to create 'rencana_aksi_pencapaian_langkah' record",
      status: 500,
    });
  }
}
