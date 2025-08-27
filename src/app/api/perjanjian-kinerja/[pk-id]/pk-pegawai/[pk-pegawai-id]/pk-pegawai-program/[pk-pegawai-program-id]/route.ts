import db from '@/db';
import { perjanjianKinerjaPegawaiProgram } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'pk-id': string;
    'pk-pegawai-id': string;
    'pk-pegawai-program-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'pk-pegawai-program-id': pkPegawaiProgramId } = await params;
    const record = await db.query.perjanjianKinerjaPegawaiProgram.findFirst({
      where: eq(
        perjanjianKinerjaPegawaiProgram.id,
        parseInt(pkPegawaiProgramId),
      ),
    });
    if (!record) {
      return NextResponse.json(
        { error: "'perjanjian_kinerja_pegawai_program' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error(
      "Error fetching 'perjanjian_kinerja_pegawai_program' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to fetch 'perjanjian_kinerja_pegawai_program' record" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'pk-pegawai-program-id': pkPegawaiProgramId } = await params;
    const body = await request.json();
    const { anggaran, subKegiatanId } = body;

    const updatedRecord = await db
      .update(perjanjianKinerjaPegawaiProgram)
      .set({ anggaran, subKegiatanId })
      .where(
        eq(perjanjianKinerjaPegawaiProgram.id, parseInt(pkPegawaiProgramId)),
      )
      .returning();

    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'perjanjian_kinerja_pegawai_program' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error(
      "Error updating 'perjanjian_kinerja_pegawai_program' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to update 'perjanjian_kinerja_pegawai_program' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'pk-pegawai-program-id': pkPegawaiProgramId } = await params;

    const deletedRecord = await db
      .delete(perjanjianKinerjaPegawaiProgram)
      .where(
        eq(perjanjianKinerjaPegawaiProgram.id, parseInt(pkPegawaiProgramId)),
      )
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'perjanjian_kinerja_pegawai_program' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message:
        "'perjanjian_kinerja_pegawai_program' record deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting 'perjanjian_kinerja_pegawai_program' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to delete 'perjanjian_kinerja_pegawai_program record" },
      { status: 500 },
    );
  }
}
