import db from '@/db';
import { cascading, sasaran } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'cascading-id': string;
    'tujuan-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'tujuan-id': tujuanId } = await params;
    const records = await db.query.sasaran.findMany({
      where: eq(sasaran.tujuanId, parseInt(tujuanId)),
      with: {
        indikatorSasaranList: true,
      },
      orderBy: sasaran.id,
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'sasaran' records: ", error);
    return NextResponse.json({
      error: "Failed to fetch all 'sasaran' records for given 'tujuanId'",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'cascading-id': cascadingId, 'tujuan-id': tujuanId } = await params;
    const body = await request.json();
    const { judul, pengampu, level, parentId } = body;

    const newRecord = await db
      .insert(sasaran)
      .values({
        judul,
        pengampu,
        level,
        tujuanId: parseInt(tujuanId),
        parentId: parentId ? parseInt(parentId) : null,
      })
      .returning();

    await db
      .update(cascading)
      .set({ updatedAt: new Date() })
      .where(eq(cascading.id, parseInt(cascadingId)));

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'sasaran' record: ", error);
    return NextResponse.json({
      error: "Failed to create 'sasaran' record",
      status: 500,
    });
  }
}
