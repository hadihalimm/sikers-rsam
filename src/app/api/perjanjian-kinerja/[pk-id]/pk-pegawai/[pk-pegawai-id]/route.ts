import db from '@/db';
import { perjanjianKinerjaPegawai } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'pk-id': string;
    'pk-pegawai-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'pk-pegawai-id': pkPegawaiId } = await params;
    const record = await db.query.perjanjianKinerjaPegawai.findFirst({
      where: eq(perjanjianKinerjaPegawai.id, parseInt(pkPegawaiId)),
    });
    if (!record) {
      return NextResponse.json(
        { error: "'perjanjian_kinerja_pegawai' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error(
      "Error fetching 'perjanjian_kinerja_pegawai' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to fetch 'perjanjian_kinerja_pegawai' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'pk-pegawai-id': pkPegawaiId } = await params;

    const deletedRecord = await db
      .delete(perjanjianKinerjaPegawai)
      .where(eq(perjanjianKinerjaPegawai.id, parseInt(pkPegawaiId)))
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'perjanjian_kinerja_pegawai' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'perjanjian_kinerja_pegawai' record deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting 'perjanjian_kinerja'_pegawai record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to delete 'perjanjian_kinerja_pegawai' record" },
      { status: 500 },
    );
  }
}
