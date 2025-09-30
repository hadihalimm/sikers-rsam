import db from '@/db';
import { indikatorTujuan } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'cascading-id': string;
    'tujuan-id': string;
    'indikator-tujuan-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'tujuan-id': tujuanId, 'indikator-tujuan-id': indikatorTujuanId } =
      await params;

    if (isNaN(parseInt(tujuanId)) || isNaN(parseInt(indikatorTujuanId))) {
      return NextResponse.json(
        { error: 'Invalid ID format. IDs must be integer.' },
        { status: 400 },
      );
    }

    const record = await db.query.indikatorTujuan.findFirst({
      where: and(
        eq(indikatorTujuan.id, parseInt(indikatorTujuanId)),
        eq(indikatorTujuan.tujuanId, parseInt(tujuanId)),
      ),
    });
    if (!record) {
      return NextResponse.json(
        { error: "'indikator_tujuan' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error("Error fetching 'indikator_tujuan' record: ", error);
    return NextResponse.json(
      { error: "Failed to fetch 'indikator_tujuan' record" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'tujuan-id': tujuanId, 'indikator-tujuan-id': indikatorTujuanId } =
      await params;
    const body = await request.json();
    const { nama } = body;

    if (isNaN(parseInt(tujuanId)) || isNaN(parseInt(indikatorTujuanId))) {
      return NextResponse.json(
        { error: 'Invalid ID format. IDs must be integer.' },
        { status: 400 },
      );
    }

    const updatedRecord = await db
      .update(indikatorTujuan)
      .set({ nama })
      .where(
        and(
          eq(indikatorTujuan.id, parseInt(indikatorTujuanId)),
          eq(indikatorTujuan.tujuanId, parseInt(tujuanId)),
        ),
      )
      .returning();

    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'indikator_tujuan' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error("Error updating 'indikator_tujuan' record: ", error);
    return NextResponse.json(
      { error: "Failed to update 'indikator_tujuan' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'tujuan-id': tujuanId, 'indikator-tujuan-id': indikatorTujuanId } =
      await params;

    if (isNaN(parseInt(tujuanId)) || isNaN(parseInt(indikatorTujuanId))) {
      return NextResponse.json(
        { error: 'Invalid ID format. IDs must be integer.' },
        { status: 400 },
      );
    }

    const deletedRecord = await db
      .delete(indikatorTujuan)
      .where(
        and(
          eq(indikatorTujuan.id, parseInt(indikatorTujuanId)),
          eq(indikatorTujuan.tujuanId, parseInt(tujuanId)),
        ),
      )
      .returning();

    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'indikator_tujuan' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'indikator_tujuan' record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting 'indikator_tujuan' record: ", error);
    return NextResponse.json(
      { error: "Failed to delete 'indikator_tujuan' record" },
      { status: 500 },
    );
  }
}
