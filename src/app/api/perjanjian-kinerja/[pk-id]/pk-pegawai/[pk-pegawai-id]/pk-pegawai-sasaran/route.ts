import db from '@/db';
import {
  indikatorSasaran,
  perjanjianKinerjaPegawaiSasaran,
  realisasiRencanaAksiPegawai,
  realisasiRencanaAksiTarget,
  rencanaAksiPegawai,
  rencanaAksiTarget,
  sasaran,
} from '@/db/schema';
import { satuan } from '@/db/schema/satuan';
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
    const records = await db
      .select({
        detail: perjanjianKinerjaPegawaiSasaran,
        satuan,
        indikatorSasaran,
        sasaran,
      })
      .from(perjanjianKinerjaPegawaiSasaran)
      .where(
        eq(
          perjanjianKinerjaPegawaiSasaran.perjanjianKinerjaPegawaiId,
          parseInt(pkPegawaiId),
        ),
      )
      .innerJoin(
        satuan,
        eq(perjanjianKinerjaPegawaiSasaran.satuanId, satuan.id),
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
      "Error fetching 'perjanjian_kinerja_pegawai_sasaran' records: ",
      error,
    );
    return NextResponse.json({
      error: "Failed to fetch all 'perjanjian_kinerja_pegawai_sasaran' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'pk-pegawai-id': pkPegawaiId } = await params;
    const body = await request.json();
    const { target, satuanId, modelCapaian, indikatorSasaranId } = body;
    const newRecord = await db
      .insert(perjanjianKinerjaPegawaiSasaran)
      .values({
        target,
        satuanId,
        modelCapaian,
        indikatorSasaranId,
        perjanjianKinerjaPegawaiId: parseInt(pkPegawaiId),
      })
      .returning();

    const raPegawaiRecord = await db.query.rencanaAksiPegawai.findFirst({
      where: eq(
        rencanaAksiPegawai.perjanjianKinerjaPegawaiId,
        parseInt(pkPegawaiId),
      ),
    });
    if (!raPegawaiRecord) {
      throw new Error(
        'rencanaAksiPegawai not found for this perjanjianKinerjaPegawai',
      );
    }

    const targets = Array.from({ length: 12 }, (_, i) => ({
      bulan: i + 1,
      target: null,
      rencanaAksiPegawaiId: raPegawaiRecord.id,
      perjanjianKinerjaPegawaiSasaranId: newRecord[0].id,
    }));
    const rencanaAksiTargetList = await db
      .insert(rencanaAksiTarget)
      .values(targets)
      .returning();

    const realisasiRencanaAksiPegawaiRecord =
      await db.query.realisasiRencanaAksiPegawai.findFirst({
        where: eq(
          realisasiRencanaAksiPegawai.rencanaAksiPegawaiId,
          raPegawaiRecord.id,
        ),
      });
    if (!realisasiRencanaAksiPegawaiRecord) {
      throw new Error(
        'realisasiRencanaAksiPegawai not found for this rencanaAksiPegawai',
      );
    }

    const realisasiTargets = rencanaAksiTargetList.map((item) => ({
      bulan: item.bulan,
      realisasi: null,
      capaian: null,
      tindakLanjut: null,
      hambatan: null,
      rencanaAksiTargetId: item.id,
      realisasiRencanaAksiPegawaiId: realisasiRencanaAksiPegawaiRecord.id,
    }));

    await db.insert(realisasiRencanaAksiTarget).values(realisasiTargets);

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error(
      "Error creating 'perjanjian_kinerja_pegawai_sasaran' record: ",
      error,
    );
    return NextResponse.json({
      error: "Failed to create 'perjanjian_kinerja_pegawai_sasaran' record",
      status: 500,
    });
  }
}
