import db from '@/db';
import { refSubKegiatan } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'ref-sub-kegiatan-id': string;
  }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ref-sub-kegiatan-id': refSubKegiatanId } = await params;
    const body = await request.json();
    const { nama } = body;

    const updatedRecord = await db
      .update(refSubKegiatan)
      .set({ nama })
      .where(eq(refSubKegiatan.id, parseInt(refSubKegiatanId)))
      .returning();

    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'ref_sub_kegiatan' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error("Error updating 'ref_sub_kegiatan' record: ", error);
    return NextResponse.json(
      { error: "Failed to update 'ref_sub_kegiatan' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ref-sub-kegiatan-id': refSubKegiatanId } = await params;

    const deletedRecord = await db
      .delete(refSubKegiatan)
      .where(eq(refSubKegiatan.id, parseInt(refSubKegiatanId)))
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'ref_sub_kegiatan' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'ref_sub_kegiatan' record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting 'ref_sub_kegiatan' record: ", error);
    return NextResponse.json(
      { error: "Failed to delete 'ref_sub_kegiatan' record" },
      { status: 500 },
    );
  }
}
