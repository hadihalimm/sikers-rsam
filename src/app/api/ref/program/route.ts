import db from '@/db';
import { refProgram } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const records = await db.query.refProgram.findMany();
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'ref_program' records: ", error);
    return NextResponse.json({
      error: "Failed to fetch all 'ref_program' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama } = body;
    const newRecord = await db.insert(refProgram).values({ nama }).returning();
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'ref_program' record: ", error);
    return NextResponse.json({
      error: "Failed to create 'ref_program' record",
      status: 500,
    });
  }
}
