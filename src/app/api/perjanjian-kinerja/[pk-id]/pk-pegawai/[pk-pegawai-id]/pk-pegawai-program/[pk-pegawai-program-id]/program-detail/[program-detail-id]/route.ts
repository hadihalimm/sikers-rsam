import db from '@/db';
import { perjanjianKinerjaPegawaiProgramDetail } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'pk-pegawai-program-id': string;
    'program-detail-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'program-detail-id': programDetailId } = await params;

    const record =
      await db.query.perjanjianKinerjaPegawaiProgramDetail.findFirst({
        where: eq(
          perjanjianKinerjaPegawaiProgramDetail.id,
          parseInt(programDetailId),
        ),
        with: {
          subKegiatan: {
            with: {
              refKegiatan: {
                with: {
                  refProgram: true,
                },
              },
            },
          },
        },
      });
    if (!record) {
      return NextResponse.json(
        {
          error: "'perjanjian_kinerja_pegawai_program_detail' record not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error(
      "Error fetching 'perjanjian_kinerja_pegawai_program_detail' record: ",
      error,
    );
    return NextResponse.json(
      {
        error:
          "Failed to fetch 'perjanjian_kinerja_pegawai_program_detail' record",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'program-detail-id': programDetailId } = await params;
    const body = await request.json();
    const { anggaran } = body;

    const updatedRecord = await db
      .update(perjanjianKinerjaPegawaiProgramDetail)
      .set({ anggaran })
      .where(
        eq(perjanjianKinerjaPegawaiProgramDetail.id, parseInt(programDetailId)),
      )
      .returning();
    if (updatedRecord.length === 0) {
      return NextResponse.json(
        {
          error: "'perjanjian_kinerja_pegawai_program_detail' record not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error(
      "Error updating 'perjanjian_kinerja_pegawai_program_detail' record: ",
      error,
    );
    return NextResponse.json(
      {
        error:
          "Failed to update 'perjanjian_kinerja_pegawai_program_detail' record",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'program-detail-id': programDetailId } = await params;
    const deletedRecord = await db
      .delete(perjanjianKinerjaPegawaiProgramDetail)
      .where(
        eq(perjanjianKinerjaPegawaiProgramDetail.id, parseInt(programDetailId)),
      )
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        {
          error: "'perjanjian_kinerja_pegawai_program_detail' record not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message:
        "'perjanjian_kinerja_pegawai_program_detail' record deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting 'perjanjian_kinerja_pegawai_detail' record: ",
      error,
    );
    return NextResponse.json(
      {
        error:
          "Failed to delete 'perjanjian_kinerja_pegawai_program_detail record",
      },
      { status: 500 },
    );
  }
}
