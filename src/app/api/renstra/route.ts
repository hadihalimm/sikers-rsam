import db from '@/db';
import { renstra } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const records = await db.query.renstra.findMany({
      with: {
        cascading: true,
      },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'renstra' records: ", error);
    return NextResponse.json({
      error: "Failed to fetch all 'renstra' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { judul, cascadingId } = body;
    const newRecord = await db
      .insert(renstra)
      .values({
        judul,
        cascadingId,
      })
      .returning();

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'renstra' record: ", error);
    return NextResponse.json({
      error: "Failed to create 'renstra' record",
      status: 500,
    });
  }
}
