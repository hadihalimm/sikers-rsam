import db from '@/db';
import { pegawai } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const records = await db.query.pegawai.findMany({});
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'pegawai' records: ", error);
    return NextResponse.json({
      error: "Failed to fetch all 'pegawai' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, jabatan } = body;
    const newRecord = await db
      .insert(pegawai)
      .values({ nama, jabatan })
      .returning();
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'pegawai' record: ", error);
    return NextResponse.json({
      error: "Failed to create 'pegawai' record",
      status: 500,
    });
  }
}
