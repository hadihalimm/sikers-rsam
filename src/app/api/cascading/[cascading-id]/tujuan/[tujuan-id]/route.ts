import db from '@/db';
import { tujuan } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { and, eq } from 'drizzle-orm';
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

    const { 'cascading-id': cascadingId, 'tujuan-id': tujuanId } = await params;
    if (isNaN(parseInt(cascadingId)) || isNaN(parseInt(tujuanId))) {
      return NextResponse.json(
        { error: 'Invalid ID format. IDs must be integer.' },
        { status: 400 },
      );
    }

    const record = await db.query.tujuan.findFirst({
      where: and(
        eq(tujuan.id, parseInt(tujuanId)),
        eq(tujuan.cascadingId, parseInt(cascadingId)),
      ),
      with: {
        indikatorTujuanList: true,
      },
    });
    if (!record) {
      return NextResponse.json(
        { error: "'tujuan' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error("Error fetching 'tujuan' record: ", error);
    return NextResponse.json(
      { error: "Failed to fetch 'tujuan' record" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'cascading-id': cascadingId, 'tujuan-id': tujuanId } = await params;
    const body = await request.json();
    const { judul } = body;

    if (isNaN(parseInt(cascadingId)) || isNaN(parseInt(tujuanId))) {
      return NextResponse.json(
        { error: 'Invalid ID format. IDs must be integer.' },
        { status: 400 },
      );
    }

    const updatedRecord = await db
      .update(tujuan)
      .set({ judul })
      .where(
        and(
          eq(tujuan.id, parseInt(tujuanId)),
          eq(tujuan.cascadingId, parseInt(cascadingId)),
        ),
      )
      .returning();

    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'tujuan' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error("Error updating 'tujuan' record: ", error);
    return NextResponse.json(
      { error: "Failed to update 'tujuan' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'cascading-id': cascadingId, 'tujuan-id': tujuanId } = await params;

    if (isNaN(parseInt(cascadingId)) || isNaN(parseInt(tujuanId))) {
      return NextResponse.json(
        { error: 'Invalid ID format. IDs must be integer.' },
        { status: 400 },
      );
    }

    const deletedRecord = await db
      .delete(tujuan)
      .where(
        and(
          eq(tujuan.id, parseInt(tujuanId)),
          eq(tujuan.cascadingId, parseInt(cascadingId)),
        ),
      )
      .returning();

    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'tujuan' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'tujuan' record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting 'tujuan' record: ", error);
    return NextResponse.json(
      { error: "Failed to delete 'tujuan' record" },
      { status: 500 },
    );
  }
}
