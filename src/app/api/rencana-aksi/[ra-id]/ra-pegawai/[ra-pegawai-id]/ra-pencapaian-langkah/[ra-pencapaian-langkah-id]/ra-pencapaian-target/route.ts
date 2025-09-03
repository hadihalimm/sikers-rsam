import db from '@/db';
import { rencanaAksiPencapaianTarget } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'ra-id': string;
    'ra-pegawai-id': string;
    'ra-pencapaian-langkah-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ra-pencapaian-langkah-id': raPencapaianLangkahId } = await params;
    const records = await db.query.rencanaAksiPencapaianTarget.findMany({
      where: eq(
        rencanaAksiPencapaianTarget.rencanaAksiPencapaianLangkahId,
        parseInt(raPencapaianLangkahId),
      ),
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error(
      "Error fetching 'rencana_aksi_pencapaian_target' records: ",
      error,
    );
    return NextResponse.json({
      error: "Failed to fetch all 'rencana_aksi_pencapaian_target' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ra-pencapaian-langkah-id': raPencapaianLangkahId } = await params;
    const body = await request.json();
    const { target, bulan } = body;

    const newRecord = await db
      .insert(rencanaAksiPencapaianTarget)
      .values({
        target,
        bulan,
        rencanaAksiPencapaianLangkahId: parseInt(raPencapaianLangkahId),
      })
      .returning();
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error(
      "Error creating 'rencana_aksi_pencapaian_target' record: ",
      error,
    );
    return NextResponse.json({
      error: "Failed to create 'rencana_aksi_pencapaian_target' record",
      status: 500,
    });
  }
}
