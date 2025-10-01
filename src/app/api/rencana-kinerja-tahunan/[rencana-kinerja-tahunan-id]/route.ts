import db from '@/db';
import { rencanaKinerjaTahunan } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'rencana-kinerja-tahunan-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'rencana-kinerja-tahunan-id': rencanaKinerjaTahunanId } =
      await params;
    const record = await db.query.rencanaKinerjaTahunan.findFirst({
      where: eq(rencanaKinerjaTahunan.id, parseInt(rencanaKinerjaTahunanId)),
    });
    if (!record) {
      return NextResponse.json(
        { error: "'rencana_kinerja_tahunan' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error("Error fetching 'rencana_kinerja_tahunan' record: ", error);
    return NextResponse.json(
      { error: "Failed to fetch 'rencana_kinerja_tahunan' record" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'rencana-kinerja-tahunan-id': rencanaKinerjaTahunanId } =
      await params;
    const body = await request.json();
    const { nama } = body;

    const updatedRecord = await db
      .update(rencanaKinerjaTahunan)
      .set({ nama, updatedAt: new Date() })
      .where(eq(rencanaKinerjaTahunan.id, parseInt(rencanaKinerjaTahunanId)))
      .returning();
    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'rencana_kinerja_tahunan' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error("Error updating 'rencana_kinerja_tahunan' record: ", error);
    return NextResponse.json(
      { error: "Failed to update 'rencana_kinerja_tahunan' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'rencana-kinerja-tahunan-id': rencanaKinerjaTahunanId } =
      await params;
    const deletedRecord = await db
      .delete(rencanaKinerjaTahunan)
      .where(eq(rencanaKinerjaTahunan.id, parseInt(rencanaKinerjaTahunanId)))
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'rencana_kinerja_tahunan' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'rencana_kinerja_tahunan' record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting 'rencana_kinerja_tahunan' record: ", error);
    return NextResponse.json(
      { error: "Failed to delete 'rencana_kinerja_tahunan' record" },
      { status: 500 },
    );
  }
}
