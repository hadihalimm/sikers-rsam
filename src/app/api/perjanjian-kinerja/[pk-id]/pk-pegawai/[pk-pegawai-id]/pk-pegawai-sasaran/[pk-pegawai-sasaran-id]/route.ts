import db from '@/db';
import { perjanjianKinerjaPegawaiSasaran } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'pk-id': string;
    'pk-pegawai-id': string;
    'pk-pegawai-sasaran-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'pk-pegawai-sasaran-id': pkPegawaiSasaranId } = await params;
    const record = await db.query.perjanjianKinerjaPegawaiSasaran.findFirst({
      where: eq(
        perjanjianKinerjaPegawaiSasaran.id,
        parseInt(pkPegawaiSasaranId),
      ),
    });
    if (!record) {
      return NextResponse.json(
        { error: "'perjanjian_kinerja_pegawai_sasaran' record not found" },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error(
      "Error fetching 'perjanjian_kinerja_pegawai_sasaran' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to fetch 'perjanjian_kinerja_pegawai_sasaran' record" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'pk-pegawai-sasaran-id': pkPegawaiSasaranId } = await params;
    const body = await request.json();
    const { target, satuanId, modelCapaian } = body;

    const updatedRecord = await db
      .update(perjanjianKinerjaPegawaiSasaran)
      .set({ target, satuanId, modelCapaian })
      .where(
        eq(perjanjianKinerjaPegawaiSasaran.id, parseInt(pkPegawaiSasaranId)),
      )
      .returning();

    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'perjanjian_kinerja_pegawai_sasaran' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error(
      "Error updating 'perjanjian_kinerja_pegawai_sasaran' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to update 'perjanjian_kinerja_pegawai_sasaran' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'pk-pegawai-sasaran-id': pkPegawaiSasaranId } = await params;

    const deletedRecord = await db
      .delete(perjanjianKinerjaPegawaiSasaran)
      .where(
        eq(perjanjianKinerjaPegawaiSasaran.id, parseInt(pkPegawaiSasaranId)),
      )
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'perjanjian_kinerja_pegawai_sasaran' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message:
        "'perjanjian_kinerja_pegawai_sasaran' record deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting 'perjanjian_kinerja_pegawai_sasaran' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to delete 'perjanjian_kinerja_pegawai_sasaran' record" },
      { status: 500 },
    );
  }
}
