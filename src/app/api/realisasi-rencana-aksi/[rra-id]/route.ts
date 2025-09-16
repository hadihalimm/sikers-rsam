import db from '@/db';
import { realisasiRencanaAksi } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'rra-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'rra-id': rraId } = await params;
    const record = await db.query.realisasiRencanaAksi.findFirst({
      where: eq(realisasiRencanaAksi.id, parseInt(rraId)),
    });
    if (!record) {
      return NextResponse.json(
        { error: "'realisasi_rencana_aksi' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error("Error fetching 'realisasi_rencana_aksi' record: ", error);
    return NextResponse.json(
      { error: "Failed to fetch 'realisasi_rencana_aksi' record" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'rra-id': rraId } = await params;
    const body = await request.json();
    const { nama } = body;

    const updatedRecord = await db
      .update(realisasiRencanaAksi)
      .set({ nama })
      .where(eq(realisasiRencanaAksi.id, parseInt(rraId)))
      .returning();
    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'realisasi_rencana_aksi' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error("Error updating 'realisasi_rencana_aksi' record: ", error);
    return NextResponse.json(
      { error: "Failed to update 'realisasi_rencana_aksi' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'rra-id': rraId } = await params;
    const deletedRecord = await db
      .delete(realisasiRencanaAksi)
      .where(eq(realisasiRencanaAksi.id, parseInt(rraId)))
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'realisasi_rencana_aksi' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'realisasi_rencana_aksi' record deleted successfully",
      deletedRecord: deletedRecord[0],
    });
  } catch (error) {
    console.error("Error deleting 'realisasi_rencana_aksi' record: ", error);
    return NextResponse.json(
      { error: "Failed to delete 'realisasi_rencana_aksi' record" },
      { status: 500 },
    );
  }
}
