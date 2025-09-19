import db from '@/db';
import { sasaran } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'tujuan-id': string;
    'sasaran-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'sasaran-id': sasaranId, 'tujuan-id': tujuanId } = await params;
    if (isNaN(parseInt(sasaranId)) || isNaN(parseInt(tujuanId))) {
      return NextResponse.json(
        { error: 'Invalid ID format. IDs must be integer.' },
        { status: 400 },
      );
    }

    const record = await db.query.sasaran.findFirst({
      where: and(
        eq(sasaran.id, parseInt(sasaranId)),
        eq(sasaran.tujuanId, parseInt(tujuanId)),
      ),
    });
    if (!record) {
      return NextResponse.json(
        { error: "'sasaran' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error("Error fetching 'sasaran' record: ", error);
    return NextResponse.json(
      { error: "Failed to fetch 'sasaran' record" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'sasaran-id': sasaranId, 'tujuan-id': tujuanId } = await params;
    if (isNaN(parseInt(sasaranId)) || isNaN(parseInt(tujuanId))) {
      return NextResponse.json(
        { error: 'Invalid ID format. IDs must be integer.' },
        { status: 400 },
      );
    }
    const body = await request.json();
    const { judul, pengampu } = body;

    const updatedRecord = await db
      .update(sasaran)
      .set({
        judul,
        pengampu,
      })
      .where(
        and(
          eq(sasaran.id, parseInt(sasaranId)),
          eq(sasaran.tujuanId, parseInt(tujuanId)),
        ),
      )
      .returning();

    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'sasaran' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error("Error updating 'sasaran' record: ", error);
    return NextResponse.json(
      { error: "Failed to update 'sasaran' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'sasaran-id': sasaranId, 'tujuan-id': tujuanId } = await params;
    if (isNaN(parseInt(sasaranId)) || isNaN(parseInt(tujuanId))) {
      return NextResponse.json(
        { error: 'Invalid ID format. IDs must be integer.' },
        { status: 400 },
      );
    }

    const deletedRecord = await db
      .delete(sasaran)
      .where(
        and(
          eq(sasaran.id, parseInt(sasaranId)),
          eq(sasaran.tujuanId, parseInt(tujuanId)),
        ),
      )

      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'sasaran' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'sasaran' record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting 'sasaran' record: ", error);
    return NextResponse.json(
      { error: "Failed to delete 'sasaran' record" },
      { status: 500 },
    );
  }
}
