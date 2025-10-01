import db from '@/db';
import { indikatorKinerjaUtama } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'indikator-kinerja-utama-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'indikator-kinerja-utama-id': indikatorKinerjaUtamaId } =
      await params;
    const record = await db.query.indikatorKinerjaUtama.findFirst({
      where: eq(indikatorKinerjaUtama.id, parseInt(indikatorKinerjaUtamaId)),
      with: {
        indikatorKinerjaUtamaDetailList: true,
      },
    });

    if (!record) {
      return NextResponse.json(
        { error: "'indikator_kinerja_utama' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error("Error fetching 'indikator_kinerja_utama' record: ", error);
    return NextResponse.json(
      { error: "Failed to fetch 'indikator_kinerja_utama' record" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'indikator-kinerja-utama-id': indikatorKinerjaUtamaId } =
      await params;
    const body = await request.json();
    const { nama } = body;

    const updatedRecord = await db
      .update(indikatorKinerjaUtama)
      .set({ nama, updatedAt: new Date() })
      .where(eq(indikatorKinerjaUtama.id, parseInt(indikatorKinerjaUtamaId)))
      .returning();

    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'indikator_kinerja_utama' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error("Error updating 'indikator_kinerja_utama' record: ", error);
    return NextResponse.json(
      { error: "Failed to update 'indikator_kinerja_utama' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'indikator-kinerja-utama-id': indikatorKinerjaUtamaId } =
      await params;

    const deletedRecord = await db
      .delete(indikatorKinerjaUtama)
      .where(eq(indikatorKinerjaUtama.id, parseInt(indikatorKinerjaUtamaId)))
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'indikator_kinerja_utama' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'indikator_kinerja_utama' record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting 'indikator_kinerja_utama' record: ", error);
    return NextResponse.json(
      { error: "Failed to delete 'indikator_kinerja_utama' record" },
      { status: 500 },
    );
  }
}
