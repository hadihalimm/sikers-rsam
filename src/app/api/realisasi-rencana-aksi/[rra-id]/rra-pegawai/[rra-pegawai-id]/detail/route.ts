import db from '@/db';
import {
  indikatorSasaran,
  perjanjianKinerjaPegawai,
  perjanjianKinerjaPegawaiProgram,
  perjanjianKinerjaPegawaiSasaran,
  realisasiRencanaAksiPegawai,
  rencanaAksiPegawai,
  sasaran,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'rra-id': string;
    'rra-pegawai-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'rra-pegawai-id': rraPegawaiId } = await params;
    const records = await db
      .select({
        realisasiRencanaAksiPegawai,
        rencanaAksiPegawai,
        perjanjianKinerjaPegawai,
        perjanjianKinerjaPegawaiSasaran,
        perjanjianKinerjaPegawaiProgram,
        indikatorSasaran,
        sasaran,
      })
      .from(realisasiRencanaAksiPegawai)
      .where(eq(realisasiRencanaAksiPegawai.id, parseInt(rraPegawaiId)))
      .innerJoin(
        rencanaAksiPegawai,
        eq(
          realisasiRencanaAksiPegawai.rencanaAksiPegawaiId,
          rencanaAksiPegawai.id,
        ),
      )
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
        perjanjianKinerjaPegawaiProgram,
        eq(
          perjanjianKinerjaPegawaiSasaran.id,
          perjanjianKinerjaPegawaiProgram.perjanjianKinerjaPegawaiSasaranId,
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
      "Error fetching 'realisasi_rencana_aksi_pegawai_detail' records: ",
      error,
    );
    return NextResponse.json({
      error:
        "Failed to fetch all 'realisasi_rencana_aksi_pegawai_detail' records",
      status: 500,
    });
  }
}
