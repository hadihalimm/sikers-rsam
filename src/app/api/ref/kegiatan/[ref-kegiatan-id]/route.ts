import db from '@/db';
import { refKegiatan } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'ref-kegiatan-id': string;
  }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ref-kegiatan-id': refKegiatanId } = await params;
    const body = await request.json();
    const { nama } = body;

    const updatedRecord = await db
      .update(refKegiatan)
      .set({ nama })
      .where(eq(refKegiatan.id, parseInt(refKegiatanId)))
      .returning();

    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'ref_kegiatan' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error("Error updating 'ref_kegiatan' record: ", error);
    return NextResponse.json(
      { error: "Failed to update 'ref_kegiatan' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ref-kegiatan-id': refKegiatanId } = await params;

    const deletedRecord = await db
      .delete(refKegiatan)
      .where(eq(refKegiatan.id, parseInt(refKegiatanId)))
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'ref_kegiatan' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'ref_kegiatan' record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting 'ref_kegiatan' record: ", error);
    return NextResponse.json(
      { error: "Failed to delete 'ref_kegiatan' record" },
      { status: 500 },
    );
  }
}
