import db from '@/db';
import { indikatorTujuan } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'cascading-id': string;
    'tujuan-id': string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'tujuan-id': tujuanId } = await params;
    const body = await request.json();
    const { nama } = body;

    const newRecord = await db
      .insert(indikatorTujuan)
      .values({
        nama,
        tujuanId: parseInt(tujuanId),
      })
      .returning();
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'indikator_tujuan' records: ", error);
    return NextResponse.json({
      error: "Failed to create 'indikator_tujuan' record",
      status: 500,
    });
  }
}
