import db from '@/db';
import { refKegiatan } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const refProgramId = request.nextUrl.searchParams.get('ref-program-id');
    const records = await db.query.refKegiatan.findMany({
      where: eq(refKegiatan.refProgramId, Number(refProgramId)),
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'ref_kegiatan' records: ", error);
    return NextResponse.json({
      error: "Failed to fetch all 'ref_kegiatan' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, refProgramId } = body;
    const newRecord = await db
      .insert(refKegiatan)
      .values({ nama, refProgramId })
      .returning();
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'ref_kegiatan' record: ", error);
    return NextResponse.json({
      error: "Failed to create 'ref_kegiatan' record",
      status: 500,
    });
  }
}
