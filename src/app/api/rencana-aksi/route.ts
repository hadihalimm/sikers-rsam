import db from '@/db';
import { rencanaAksi } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id;
    const records = await db.query.rencanaAksi.findMany({
      where: eq(rencanaAksi.userId, userId),
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'rencana_aksi' records: ", error);
    return NextResponse.json({
      error: "Failed to fetch all 'rencana_aksi' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { nama, tahun } = body;

    const userId = session.user.id;
    const newRecord = await db
      .insert(rencanaAksi)
      .values({ nama, tahun, userId, perjanjianKinerjaId: 0 })
      .returning();
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'rencana_aksi' record: ", error);
    return NextResponse.json({
      error: "Failed to create 'rencana_aksi' record",
      status: 500,
    });
  }
}
