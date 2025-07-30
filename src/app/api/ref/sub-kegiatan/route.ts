import { NextRequest, NextResponse } from 'next/server';
import db from '@/db';
import { eq } from 'drizzle-orm';
import { refSubKegiatan } from '@/db/schema';

export async function GET(request: NextRequest) {
  try {
    const refKegiatanId = request.nextUrl.searchParams.get('ref-kegiatan-id');
    const records = await db.query.refSubKegiatan.findMany({
      where: eq(refSubKegiatan.refKegiatanId, Number(refKegiatanId)),
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'ref_sub_kegiatan' records: ", error);
    return NextResponse.json({
      error: "Failed to fetch all 'ref_sub_kegiatan' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, refKegiatanId } = body;
    const newRecord = await db
      .insert(refSubKegiatan)
      .values({ nama, refKegiatanId })
      .returning();
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'ref_sub_kegiatan' record: ", error);
    return NextResponse.json({
      error: "Failed to create 'ref_sub_kegiatan' record",
      status: 500,
    });
  }
}
