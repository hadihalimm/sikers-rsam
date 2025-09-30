import db from '@/db';
import { rencanaAksiPegawai } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'ra-id': string;
    'ra-pegawai-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ra-pegawai-id': raPegawaiId } = await params;
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const record = await db.query.rencanaAksiPegawai.findFirst({
      where: eq(rencanaAksiPegawai.id, parseInt(raPegawaiId)),
      with: {
        pegawai: true,
      },
    });
    if (!record) {
      return NextResponse.json(
        { error: "'rencana_aksi_pegawai' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error("Error fetching 'rencana_aksi_pegawai' record: ", error);
    return NextResponse.json(
      { error: "Failed to fetch 'rencana_aksi_pegawai' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ra-pegawai-id': raPegawaiId } = await params;
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const deletedRecord = await db
      .delete(rencanaAksiPegawai)
      .where(eq(rencanaAksiPegawai.id, parseInt(raPegawaiId)))
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'rencana_aksi_pegawai' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'rencana_aksi_pegawai' record deleted successfully",
      deletedRecord: deletedRecord[0],
    });
  } catch (error) {
    console.error("Error deleting 'rencana_aksi_pegawai' record: ", error);
    return NextResponse.json(
      { error: "Failed to delete 'rencana_aksi_pegawai' record" },
      { status: 500 },
    );
  }
}
