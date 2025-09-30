import db from '@/db';
import { satuan } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const records = await db.select().from(satuan);
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'satuan' records: ", error);
    return NextResponse.json({
      error: "Failed to fetch all 'satuan' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama } = body;
    const newRecord = await db.insert(satuan).values({ nama }).returning();

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'satuan' record: ", error);
    return NextResponse.json(
      {
        error: "Failed to create 'satuan' record",
      },
      { status: 500 },
    );
  }
}
