import db from '@/db';
import { pegawai } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const records = await db.query.pegawai.findMany({
      where: userId ? eq(pegawai.userId, userId!) : undefined,
    });
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
    const { nama, jabatan, userId } = body;
    const newRecord = await db
      .insert(pegawai)
      .values({ nama, jabatan, userId })
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
