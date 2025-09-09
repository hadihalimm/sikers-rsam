import db from '@/db';
import {
  indikatorSasaran,
  perjanjianKinerjaPegawai,
  perjanjianKinerjaPegawaiProgram,
  perjanjianKinerjaPegawaiSasaran,
  rencanaAksiPegawai,
  sasaran,
} from '@/db/schema';
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
    const { 'ra-pegawai-id': raPegawaiId } = await params;

    const records = await db
      .select({
        rencanaAksiPegawai,
        perjanjianKinerjaPegawai,
        perjanjianKinerjaPegawaiSasaran,
        perjanjianKinerjaPegawaiProgram,
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
      "Error fetching 'rencana_aksi_pegawai_detail' records: ",
      error,
    );
    return NextResponse.json({
      error: "Failed to fetch all 'rencana_aksi_pegawai_detail' records",
      status: 500,
    });
  }
}
