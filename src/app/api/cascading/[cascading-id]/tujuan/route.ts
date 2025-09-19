import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import db from '@/db';
import { tujuan } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';

interface RouteParams {
  params: Promise<{
    'cascading-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'cascading-id': cascadingId } = await params;
    const records = await db.query.tujuan.findMany({
      where: eq(tujuan.cascadingId, parseInt(cascadingId)),
      with: {
        indikatorTujuanList: true,
      },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'tujuan' records: ", error);
    return NextResponse.json({
      error: "Failed to fetch all 'tujuan' records for given 'cascadingId'",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'cascading-id': cascadingId } = await params;
    const body = await request.json();
    const { judul } = body;

    const newRecord = await db
      .insert(tujuan)
      .values({
        judul,
        cascadingId: parseInt(cascadingId),
      })
      .returning();

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'tujuan' records: ", error);
    return NextResponse.json({
      error: "Failed to create 'tujuan' record",
      status: 500,
    });
  }
}
