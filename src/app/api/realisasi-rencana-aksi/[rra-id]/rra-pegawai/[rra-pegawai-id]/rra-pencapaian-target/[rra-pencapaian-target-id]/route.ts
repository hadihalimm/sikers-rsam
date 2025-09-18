import db from '@/db';
import { realisasiRencanaAksiPencapaianTarget } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'rra-id': string;
    'rra-pegawai-id': string;
    'rra-pencapaian-target-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { 'rra-pencapaian-target-id': rraPencapaianTargetId } = await params;
    const record = await db.query.realisasiRencanaAksiPencapaianTarget.findMany(
      {
        where: eq(
          realisasiRencanaAksiPencapaianTarget.id,
          parseInt(rraPencapaianTargetId),
        ),
      },
    );
    if (!record) {
      return NextResponse.json(
        {
          error: "'realisasi_rencana_aksi_pencapaian_target' record not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error(
      "Error fetching 'realisasi_rencana_aksi_pencapaian_target' record: ",
      error,
    );
    return NextResponse.json(
      {
        error:
          "Failed to fetch 'realisasi_rencana_aksi_pencapaian_target' record",
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
    const { 'rra-pencapaian-target-id': rraPencapaianTargetId } = await params;
    const body = await request.json();
    const { realisasi } = body;

    const rraPencapaianTarget =
      await db.query.realisasiRencanaAksiPencapaianTarget.findFirst({
        where: eq(
          realisasiRencanaAksiPencapaianTarget.id,
          parseInt(rraPencapaianTargetId),
        ),
        with: {
          rencanaAksiPencapaianTarget: true,
        },
      });
    if (!rraPencapaianTarget)
      throw new Error("'realisasi_pencapaian_target' not found");

    const capaian = calculateCapaian(
      rraPencapaianTarget.rencanaAksiPencapaianTarget.target,
      realisasi,
    );
    const updatedRecord = await db
      .update(realisasiRencanaAksiPencapaianTarget)
      .set({ realisasi, capaian })
      .where(
        eq(
          realisasiRencanaAksiPencapaianTarget.id,
          parseInt(rraPencapaianTargetId),
        ),
      )
      .returning();
    if (updatedRecord.length === 0) {
      return NextResponse.json(
        {
          error: "'realisasi_rencana_aksi_pencapaian_target' record not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error(
      "Error updating 'realisasi_rencana_aksi_pencapaian_target' record: ",
      error,
    );
    return NextResponse.json(
      {
        error:
          "Failed to update 'realisasi_rencana_aksi_pencapaian_target' record",
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
    const { 'rra-pencapaian-target-id': rraPencapaianTargetId } = await params;
    const deletedRecord = await db
      .delete(realisasiRencanaAksiPencapaianTarget)
      .where(
        eq(
          realisasiRencanaAksiPencapaianTarget.id,
          parseInt(rraPencapaianTargetId),
        ),
      )
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        {
          error: "'realisasi_rencana_aksi_pencapaian_target' record not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message:
        "'realisasi_rencana_aksi_pencapaian_target' record deleted successfully",
      deletedRecord: deletedRecord[0],
    });
  } catch (error) {
    console.error(
      "Error deleting 'realisasi_rencana_aksi_pencapaian_target' record: ",
      error,
    );
    return NextResponse.json(
      {
        error:
          "Failed to delete 'realisasi_rencana_aksi_pencapaian_target' record",
      },
      { status: 500 },
    );
  }
}

const calculateCapaian = (target: number | null, realisasi: number | null) => {
  if (target === null || realisasi === null) return null;
  return (realisasi / target) * 100;
};
