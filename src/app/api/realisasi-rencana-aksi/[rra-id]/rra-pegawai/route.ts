import db from '@/db';
import { realisasiRencanaAksiPegawai } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'rra-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { 'rra-id': rraId } = await params;
    const records = await db.query.realisasiRencanaAksiPegawai.findMany({
      where: eq(
        realisasiRencanaAksiPegawai.realisasiRencanaAksiId,
        parseInt(rraId),
      ),
      with: {
        pegawai: true,
      },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error(
      "Error fetching 'realisasi_rencana_aksi_pegawai' records: ",
      error,
    );
    return NextResponse.json(
      { error: "'realisasi_rencana_aksi_pegawai' record not found" },
      { status: 404 },
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { 'rra-id': rraId } = await params;
    const body = await request.json();
    const { tahun, pegawaiId, rencanaAksiPegawaiId } = body;

    const newRecord = await db
      .insert(realisasiRencanaAksiPegawai)
      .values({
        tahun,
        pegawaiId,
        rencanaAksiPegawaiId,
        realisasiRencanaAksiId: parseInt(rraId),
      })
      .returning();
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error(
      "Error creating 'realisasi_rencana_aksi_pegawai' record: ",
      error,
    );
    return NextResponse.json(
      {
        error: "Failed to create 'realisasi_rencana_aksi_pegawai' record",
      },
      { status: 404 },
    );
  }
}
