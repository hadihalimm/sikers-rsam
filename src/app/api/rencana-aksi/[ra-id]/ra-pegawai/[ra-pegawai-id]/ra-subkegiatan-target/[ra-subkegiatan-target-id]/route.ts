import db from '@/db';
import { rencanaAksiSubKegiatanTarget } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'ra-id': string;
    'ra-pegawai-id': string;
    'ra-subkegiatan-target-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ra-subkegiatan-target-id': raSubkegiatanTargetId } = await params;
    const record = await db.query.rencanaAksiSubKegiatanTarget.findFirst({
      where: eq(
        rencanaAksiSubKegiatanTarget.id,
        parseInt(raSubkegiatanTargetId),
      ),
    });
    if (!record) {
      return NextResponse.json(
        { error: "'rencana_aksi_subkegiatan_target' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error(
      "Error fetching 'rencana_aksi_subkegiatan_target' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to fetch 'rencana_aksi_subkegiatan_target' record" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ra-subkegiatan-target-id': raSubkegiatanTargetId } = await params;
    const body = await request.json();
    const { target, satuan } = body;

    const updatedRecord = await db
      .update(rencanaAksiSubKegiatanTarget)
      .set({ target, satuan })
      .where(
        eq(rencanaAksiSubKegiatanTarget.id, parseInt(raSubkegiatanTargetId)),
      )
      .returning();
    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'rencana_aksi_subkegiatan_target' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error(
      "Error updating 'rencana_aksi_subkegiatan_target' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to update 'rencana_aksi_subkegiatan_target' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ra-subkegiatan-target-id': raSubkegiatanTargetId } = await params;
    const deletedRecord = await db
      .delete(rencanaAksiSubKegiatanTarget)
      .where(
        eq(rencanaAksiSubKegiatanTarget.id, parseInt(raSubkegiatanTargetId)),
      )
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'rencana_aksi_subkegiatan_target' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'rencana_aksi_subkegiatan_target' record deleted successfully",
      deletedRecord: deletedRecord[0],
    });
  } catch (error) {
    console.error(
      "Error deleting 'rencana_aksi_subkegiatan_target' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to delete 'rencana_aksi_subkegiatan_target' record" },
      { status: 500 },
    );
  }
}
