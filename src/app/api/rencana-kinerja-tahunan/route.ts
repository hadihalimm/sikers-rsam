import db from '@/db';
import { rencanaKinerjaTahunan } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const records = await db.query.rencanaKinerjaTahunan.findMany({});
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'rencana_kinerja_tahunan' records: ", error);
    return NextResponse.json({
      error: "Failed to fetch all 'rencana_kinerja_tahunan' records",
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
    const { nama, tahun, cascadingId } = body;

    const newRecord = await db
      .insert(rencanaKinerjaTahunan)
      .values({ nama, tahun, cascadingId });
    return NextResponse.json(newRecord);
  } catch (error) {
    console.error("Error creating 'rencana_kinerja_tahunan' record: ", error);
    return NextResponse.json({
      error: "Failed to create 'rencana_kinerja_tahunan' record",
      status: 500,
    });
  }
}
