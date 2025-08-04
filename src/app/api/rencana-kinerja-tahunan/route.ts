import db from '@/db';
import { rencanaKinerjaTahunan } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const records = await db.query.rencanaKinerjaTahunan.findMany({});
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'rencana_kinerja_tahunan' records: ", error);
    return NextResponse.json({
      error: "Failed to fetch all 'rencana_kinerja_tahunan' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, tahun, cascadingId } = body;

    const newRecord = await db
      .insert(rencanaKinerjaTahunan)
      .values({ nama, tahun, cascadingId });
    return NextResponse.json(newRecord);
  } catch (error) {
    console.error("Error creating 'rencana_kinerja_tahunan' record: ", error);
    return NextResponse.json({
      error: "Failed to create 'rencana_kinerja_tahunan' record",
      status: 500,
    });
  }
}
