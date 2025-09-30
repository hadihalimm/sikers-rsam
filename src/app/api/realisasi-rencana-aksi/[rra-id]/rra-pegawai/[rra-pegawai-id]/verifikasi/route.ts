import db from '@/db';
import { realisasiRencanaAksiPegawai } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'rra-id': string;
    'rra-pegawai-id': string;
  }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'rra-pegawai-id': rraPegawaiId } = await params;
    const body = await request.json();
    const { status } = body;
    const updatedRecord = await db
      .update(realisasiRencanaAksiPegawai)
      .set({ status })
      .where(eq(realisasiRencanaAksiPegawai.id, parseInt(rraPegawaiId)))
      .returning();

    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'realisasi_rencana_aksi_pegawai' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error(
      "Error when doing verification on 'realisasi_rencana_aksi_pegawai' records: ",
      error,
    );
    return NextResponse.json({
      error:
        "Failed when doing verification on 'realisasi_rencana_aksi_pegawai' records",
      status: 500,
    });
  }
}
