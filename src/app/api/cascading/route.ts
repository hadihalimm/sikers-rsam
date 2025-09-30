import db from '@/db';
import { cascading } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
