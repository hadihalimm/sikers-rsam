import db from '@/db';
import { rencanaAksi } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'ra-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ra-id': raId } = await params;
    const record = await db.query.rencanaAksi.findFirst({
      where: eq(rencanaAksi.id, parseInt(raId)),
    });
    if (!record) {
      return NextResponse.json(
        { error: "'rencana_aksi' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error("Error fetching 'rencana_aksi' record: ", error);
    return NextResponse.json(
      { error: "Failed to fetch 'rencana_aksi' record" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ra-id': raId } = await params;
    const body = await request.json();
    const { nama } = body;

    const updatedRecord = await db
      .update(rencanaAksi)
      .set({ nama })
      .where(eq(rencanaAksi.id, parseInt(raId)))
      .returning();
    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'rencana_aksi' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error("Error updating 'rencana_aksi' record: ", error);
    return NextResponse.json(
      { error: "Failed to update 'rencana_aksi' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ra-id': raId } = await params;
    const deletedRecord = await db
      .delete(rencanaAksi)
      .where(eq(rencanaAksi.id, parseInt(raId)))
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'rencana_aksi' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'rencana_aksi' record deleted successfully",
      deletedRecord: deletedRecord[0],
    });
  } catch (error) {
    console.error("Error deleting 'rencana_aksi' record: ", error);
    return NextResponse.json(
      { error: "Failed to delete 'rencana_aksi' record" },
      { status: 500 },
    );
  }
}
