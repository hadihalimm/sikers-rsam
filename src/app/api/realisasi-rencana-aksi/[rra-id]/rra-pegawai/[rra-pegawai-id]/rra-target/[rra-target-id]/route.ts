import db from '@/db';
import { realisasiRencanaAksiTarget } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'rra-id': string;
    'rra-pegawai-id': string;
    'rra-target-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'rra-target-id': rraTargetId } = await params;
    const record = await db.query.realisasiRencanaAksiTarget.findFirst({
      where: eq(realisasiRencanaAksiTarget.id, parseInt(rraTargetId)),
    });
    if (!record) {
      return NextResponse.json(
        { error: "'realisasi_rencana_aksi_target' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error(
      "Error fetching 'realisasi_rencana_aksi_target' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to fetch 'realisasi_rencana_aksi_target' record" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'rra-target-id': rraTargetId } = await params;
    const body = await request.json();
    const { realisasi, capaian, tindakLanjut, hambatan } = body;

    const updatedRecord = await db
      .update(realisasiRencanaAksiTarget)
      .set({ realisasi, capaian, tindakLanjut, hambatan })
      .where(eq(realisasiRencanaAksiTarget.id, parseInt(rraTargetId)))
      .returning();
    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'realisasi_rencana_aksi_target' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error(
      "Error updating 'realisasi_rencana_aksi_target' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to update 'realisasi_rencana_aksi_target' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'rra-target-id': rraTargetId } = await params;
    const deletedRecord = await db
      .delete(realisasiRencanaAksiTarget)
      .where(eq(realisasiRencanaAksiTarget.id, parseInt(rraTargetId)))
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'realisasi_rencana_aksi_target' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'realisasi_rencana_aksi_target' record deleted successfully",
      deletedRecord: deletedRecord[0],
    });
  } catch (error) {
    console.error(
      "Error deleting 'realisasi_rencana_aksi_target' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to delete 'realisasi_rencana_aksi_target' record" },
      { status: 500 },
    );
  }
}
