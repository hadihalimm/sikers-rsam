import db from '@/db';
import { rencanaAksiPencapaianTarget } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'ra-id': string;
    'ra-pegawai-id': string;
    'ra-pencapaian-langkah-id': string;
    'ra-pencapaian-target-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { 'ra-pencapaian-target-id': raPencapaianTargetId } = await params;
    const record = await db.query.rencanaAksiTarget.findFirst({
      where: eq(rencanaAksiPencapaianTarget.id, parseInt(raPencapaianTargetId)),
    });
    if (!record) {
      return NextResponse.json(
        { error: "'rencana_aksi_pencapaian_target' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error(
      "Error fetching 'rencana_aksi_pencapaian_target' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to fetch 'rencana_aksi_pencapaian_target' record" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { 'ra-pencapaian-target-id': raPencapaianTargetId } = await params;
    const body = await request.json();
    const { target, satuanId } = body;

    const updatedRecord = await db
      .update(rencanaAksiPencapaianTarget)
      .set({ target, satuanId })
      .where(eq(rencanaAksiPencapaianTarget.id, parseInt(raPencapaianTargetId)))
      .returning();
    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'rencana_aksi_pencapaian_target' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error(
      "Error updating 'rencana_aksi_pencapaian_target' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to update 'rencana_aksi_pencapaian_target' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ra-pencapaian-target-id': raPencapaianTargetId } = await params;
    const deletedRecord = await db
      .delete(rencanaAksiPencapaianTarget)
      .where(eq(rencanaAksiPencapaianTarget.id, parseInt(raPencapaianTargetId)))
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'rencana_aksi_pencapaian_target' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'rencana_aksi_pencapaian_target' record deleted successfully",
      deletedRecord: deletedRecord[0],
    });
  } catch (error) {
    console.error(
      "Error deleting 'rencana_aksi_pencapaian_target' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to delete 'rencana_aksi_pencapaian_target' record" },
      { status: 500 },
    );
  }
}
