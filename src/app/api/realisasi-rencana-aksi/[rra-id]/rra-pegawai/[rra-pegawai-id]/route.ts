import db from '@/db';
import { realisasiRencanaAksiPegawai } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'rra-id': string;
    'rra-pegawai-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'rra-pegawai-id': rraPegawaiId } = await params;
    const record = await db.query.realisasiRencanaAksiPegawai.findFirst({
      where: eq(realisasiRencanaAksiPegawai.id, parseInt(rraPegawaiId)),
      with: {
        pegawai: true,
      },
    });
    if (!record) {
      return NextResponse.json(
        { error: "'realisasi_rencana_aksi_pegawai' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error(
      "Error fetching 'realisasi_rencana_aksi_pegawai' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to fetch 'realisasi_rencana_aksi_pegawai' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'rra-pegawai-id': rraPegawaiId } = await params;

    const deletedRecord = await db
      .delete(realisasiRencanaAksiPegawai)
      .where(eq(realisasiRencanaAksiPegawai.id, parseInt(rraPegawaiId)))
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'realisasi_rencana_aksi_pegawai' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'realisasi_rencana_aksi_pegawai' record deleted successfully",
      deletedRecord: deletedRecord[0],
    });
  } catch (error) {
    console.error(
      "Error deleting 'realisasi_rencana_aksi_pegawai' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to delete 'realisasi_rencana_aksi_pegawai' record" },
      { status: 500 },
    );
  }
}
