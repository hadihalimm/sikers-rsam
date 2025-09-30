import db from '@/db';
import {
  indikatorSasaran,
  perjanjianKinerjaPegawai,
  perjanjianKinerjaPegawaiSasaran,
  rencanaAksiPegawai,
  sasaran,
} from '@/db/schema';
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
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { 'ra-pegawai-id': raPegawaiId } = await params;

    const records = await db
      .select({
        rencanaAksiPegawai,
        perjanjianKinerjaPegawai,
        perjanjianKinerjaPegawaiSasaran,
        indikatorSasaran,
        sasaran,
      })
      .from(rencanaAksiPegawai)
      .where(eq(rencanaAksiPegawai.id, parseInt(raPegawaiId)))
      .innerJoin(
        perjanjianKinerjaPegawai,
        eq(
          rencanaAksiPegawai.perjanjianKinerjaPegawaiId,
          perjanjianKinerjaPegawai.id,
        ),
      )
      .innerJoin(
        perjanjianKinerjaPegawaiSasaran,
        eq(
          perjanjianKinerjaPegawaiSasaran.perjanjianKinerjaPegawaiId,
          perjanjianKinerjaPegawai.id,
        ),
      )
      .innerJoin(
        indikatorSasaran,
        eq(
          perjanjianKinerjaPegawaiSasaran.indikatorSasaranId,
          indikatorSasaran.id,
        ),
      )
      .innerJoin(sasaran, eq(indikatorSasaran.sasaranId, sasaran.id));
    return NextResponse.json(records);
  } catch (error) {
    console.error(
      "Error fetching 'rencana_aksi_pegawai_detail' records: ",
      error,
    );
    return NextResponse.json({
      error: "Failed to fetch all 'rencana_aksi_pegawai_detail' records",
      status: 500,
    });
  }
}
