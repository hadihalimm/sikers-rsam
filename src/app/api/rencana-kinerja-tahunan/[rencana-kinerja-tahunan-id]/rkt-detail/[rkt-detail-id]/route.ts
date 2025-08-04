import db from '@/db';
import { rencanaKinerjaTahunanDetail } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'rencana-kinerja-tahunan-id': string;
    'rkt-detail-id': string;
  }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'rkt-detail-id': rktDetailId } = await params;
    const body = await request.json();
    const { target } = body;

    const updatedRecord = await db
      .update(rencanaKinerjaTahunanDetail)
      .set({ target })
      .where(eq(rencanaKinerjaTahunanDetail.id, parseInt(rktDetailId)))
      .returning();
    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'rencana_kinerja_tahunan_detail' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error(
      "Error updating 'rencana_kinerja_tahunan_detail' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to update 'rencana_kinerja_tahunan_detail' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'rkt-detail-id': rktDetailId } = await params;
    const deletedRecord = await db
      .delete(rencanaKinerjaTahunanDetail)
      .where(eq(rencanaKinerjaTahunanDetail.id, parseInt(rktDetailId)))
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'rencana_kinerja_tahunan_detail' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'rencana_kinerja_tahunan_detail' record deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting 'rencana_kinerja_tahunan_detail' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to delete 'rencana_kinerja_tahunan_detail' record" },
      { status: 500 },
    );
  }
}
