import db from '@/db';
import { realisasiRencanaAksiSubkegiatanTarget } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'rra-id': string;
    'rra-pegawai-id': string;
    'rra-subkegiatan-target-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { 'rra-subkegiatan-target-id': rraSubkegiatanTargetId } =
      await params;
    const record =
      await db.query.realisasiRencanaAksiSubkegiatanTarget.findFirst({
        where: eq(
          realisasiRencanaAksiSubkegiatanTarget.id,
          parseInt(rraSubkegiatanTargetId),
        ),
      });
    if (!record) {
      return NextResponse.json(
        {
          error: "'realisasi_rencana_aksi_subkegiatan_target' record not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error(
      "Error fetching 'realisasi_rencana_aksi_subkegiatan_target' record: ",
      error,
    );
    return NextResponse.json(
      {
        error:
          "Failed to fetch 'realisasi_rencana_aksi_subkegiatan_target' record",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { 'rra-subkegiatan-target-id': rraSubkegiatanTargetId } =
      await params;
    const body = await request.json();
    const { realisasi, realisasiAnggaran } = body;

    const updatedRecord = await db
      .update(realisasiRencanaAksiSubkegiatanTarget)
      .set({ realisasi, realisasiAnggaran })
      .where(
        eq(
          realisasiRencanaAksiSubkegiatanTarget.id,
          parseInt(rraSubkegiatanTargetId),
        ),
      )
      .returning();
    if (updatedRecord.length === 0) {
      return NextResponse.json(
        {
          error: "'realisasi_rencana_aksi_subkegiatan_target' record not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error(
      "Error updating 'realisasi_rencana_aksi_subkegiatan_target' record: ",
      error,
    );
    return NextResponse.json(
      {
        error:
          "Failed to update 'realisasi_rencana_aksi_subkegiatan_target' record",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { 'rra-subkegiatan-target-id': rraSubkegiatanTargetId } =
      await params;
    const deletedRecord = await db
      .delete(realisasiRencanaAksiSubkegiatanTarget)
      .where(
        eq(
          realisasiRencanaAksiSubkegiatanTarget.id,
          parseInt(rraSubkegiatanTargetId),
        ),
      )
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        {
          error: "'realisasi_rencana_aksi_subkegiatan_target' record not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message:
        "'realisasi_rencana_aksi_subkegiatan_target' record deleted successfully",
      deletedRecord: deletedRecord[0],
    });
  } catch (error) {
    console.error(
      "Error deleting 'realisasi_rencana_aksi_subkegiatan_target' record: ",
      error,
    );
    return NextResponse.json(
      {
        error:
          "Failed to delete 'realisasi_rencana_aksi_subkegiatan_target' record",
      },
      { status: 500 },
    );
  }
}
