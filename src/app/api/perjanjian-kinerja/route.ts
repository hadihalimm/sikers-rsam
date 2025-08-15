import db from '@/db';
import { perjanjianKinerja } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const records = await db.query.perjanjianKinerja.findMany({
      where: userId ? eq(perjanjianKinerja.userId, userId!) : undefined,
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'perjanjian_kinerja' records: ", error);
    return NextResponse.json({
      error: "Failed to fetch all 'perjanjian_kinerja' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, tahun, userId } = body;
    const newRecord = await db
      .insert(perjanjianKinerja)
      .values({ nama, tahun, userId })
      .returning();
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'perjanjian_kinerja' record: ", error);
    return NextResponse.json({
      error: "Failed to create 'perjanjian_kinerja' record",
      status: 500,
    });
  }
}
