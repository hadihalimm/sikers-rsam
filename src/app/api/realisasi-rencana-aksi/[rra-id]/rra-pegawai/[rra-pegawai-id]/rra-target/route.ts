import db from '@/db';
import {
  perjanjianKinerjaPegawaiSasaran,
  realisasiRencanaAksiTarget,
  rencanaAksiTarget,
  satuan,
} from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
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
        realisasiRencanaAksiTarget,
        rencanaAksiTarget,
        perjanjianKinerjaPegawaiSasaran,
        satuan,
      })
      .from(realisasiRencanaAksiTarget)
      .where(
        eq(
          realisasiRencanaAksiTarget.realisasiRencanaAksiPegawaiId,
          parseInt(rraPegawaiId),
        ),
      )
      .innerJoin(
        rencanaAksiTarget,
        eq(
          realisasiRencanaAksiTarget.rencanaAksiTargetId,
          rencanaAksiTarget.id,
        ),
      )
      .innerJoin(
        perjanjianKinerjaPegawaiSasaran,
        eq(
          rencanaAksiTarget.perjanjianKinerjaPegawaiSasaranId,
          perjanjianKinerjaPegawaiSasaran.id,
        ),
      )
      .innerJoin(
        satuan,
        eq(perjanjianKinerjaPegawaiSasaran.satuanId, satuan.id),
      )
      .orderBy(asc(realisasiRencanaAksiTarget.bulan));
    return NextResponse.json(records);
  } catch (error) {
    console.error(
      "Error fetching 'realisasi_rencana_aksi_target' records: ",
      error,
    );
    return NextResponse.json(
      { error: "'realisasi_rencana_aksi_target' record not found" },
      { status: 404 },
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'rra-pegawai-id': rraPegawaiId } = await params;
    const body = await request.json();
    const {
      bulan,
      realisasi,
      capaian,
      tindakLanjut,
      hambatan,
      rencanaAksiTargetId,
    } = body;

    const newRecord = await db
      .insert(realisasiRencanaAksiTarget)
      .values({
        bulan,
        realisasi,
        capaian,
        tindakLanjut,
        hambatan,
        rencanaAksiTargetId,
        realisasiRencanaAksiPegawaiId: parseInt(rraPegawaiId),
      })
      .returning();
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error(
      "Error creating 'realisasi_rencana_aksi_target' record: ",
      error,
    );
    return NextResponse.json(
      {
        error: "Failed to create 'realisasi_rencana_aksi_target' record",
      },
      { status: 404 },
    );
  }
}
