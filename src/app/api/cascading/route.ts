import db from '@/db';
import { cascading } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const records = await db.select().from(cascading);
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching cascading records: ', error);
    return NextResponse.json({
      error: "Failed to fetch all 'cascading' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { judul, tahunMulai, tahunBerakhir } = body;
    const newRecord = await db
      .insert(cascading)
      .values({
        judul,
        tahunMulai,
        tahunBerakhir,
      })
      .returning();

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'cascading' record: ", error);
    return NextResponse.json({
      error: "Failed to create 'cascading' record",
      status: 500,
    });
  }
}
