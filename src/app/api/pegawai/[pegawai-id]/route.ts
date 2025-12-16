import db from '@/db';
import { pegawai } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'pegawai-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'pegawai-id': pegawaiId } = await params;
    const record = await db.query.pegawai.findFirst({
      where: eq(pegawai.id, parseInt(pegawaiId)),
    });
    if (!record) {
      return NextResponse.json(
        { error: "'pegawai' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error("Error fetching 'pegawai' record: ", error);
    return NextResponse.json(
      { error: "Failed to fetch 'pegawai' record" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'pegawai-id': pegawaiId } = await params;
    const body = await request.json();
    const { nama, nip, jabatan, profesi, penempatan } = body;

    const updatedRecord = await db
      .update(pegawai)
      .set({ nama, nip, jabatan, profesi, penempatan })
      .where(eq(pegawai.id, parseInt(pegawaiId)))
      .returning();

    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'pegawai' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error("Error updating 'pegawai' record: ", error);
    return NextResponse.json(
      { error: "Failed to update 'pegawai' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'pegawai-id': pegawaiId } = await params;

    const deletedRecord = await db
      .delete(pegawai)
      .where(eq(pegawai.id, parseInt(pegawaiId)))
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'pegawai' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'pegawai' record deleted successfully",
      deletedRecord: deletedRecord[0],
    });
  } catch (error) {
    console.error("Error deleting 'pegawai' record: ", error);
    return NextResponse.json(
      { error: "Failed to delete 'pegawai' record" },
      { status: 500 },
    );
  }
}
