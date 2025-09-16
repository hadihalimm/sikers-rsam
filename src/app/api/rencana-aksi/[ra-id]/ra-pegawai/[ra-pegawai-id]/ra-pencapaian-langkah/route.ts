import db from '@/db';
import {
  realisasiRencanaAksiPegawai,
  realisasiRencanaAksiPencapaianTarget,
  rencanaAksiPencapaianLangkah,
  rencanaAksiPencapaianTarget,
} from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
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
    const records = await db.query.rencanaAksiPencapaianLangkah.findMany({
      where: eq(
        rencanaAksiPencapaianLangkah.rencanaAksiPegawaiId,
        parseInt(raPegawaiId),
      ),
      with: {
        rencanaAksiPencapaianTargetList: {
          orderBy: () => [asc(rencanaAksiPencapaianTarget.bulan)],
          with: {
            satuan: true,
          },
        },
      },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error(
      "Error fetching 'rencana_aksi_pencapaian_langkah' records: ",
      error,
    );
    return NextResponse.json({
      error: "Failed to fetch all 'rencana_aksi_pencapaian_langkah' records",
      status: 500,
    });
  }
}

export type RencanaAksiPencapaianInput = {
  nama: string;
  satuanId: number;
  pkPegawaiSasaranId: number;
  targetList: { bulan: number; target: number | null; id: number }[];
};

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ra-pegawai-id': raPegawaiId } = await params;
    const body = (await request.json()) as RencanaAksiPencapaianInput;
    const { nama, satuanId, targetList, pkPegawaiSasaranId } = body;

    const newLangkah = await db
      .insert(rencanaAksiPencapaianLangkah)
      .values({
        nama,
        perjanjianKinerjaPegawaiSasaranId: pkPegawaiSasaranId,
        rencanaAksiPegawaiId: parseInt(raPegawaiId),
      })
      .returning();

    const newTargets = await db
      .insert(rencanaAksiPencapaianTarget)
      .values(
        targetList.map((item) => ({
          bulan: item.bulan,
          target: item.target,
          satuanId,
          rencanaAksiPencapaianLangkahId: newLangkah[0].id,
        })),
      )
      .returning();

    const rraPegawaiRecord =
      await db.query.realisasiRencanaAksiPegawai.findFirst({
        where: eq(
          realisasiRencanaAksiPegawai.rencanaAksiPegawaiId,
          parseInt(raPegawaiId),
        ),
      });
    if (!rraPegawaiRecord)
      throw new Error(
        'realisasiRencanaAksiPegawai not found for this rencanaAksiPegawaiId',
      );

    await db.insert(realisasiRencanaAksiPencapaianTarget).values(
      newTargets.map((item) => ({
        realisasi: null,
        capaian: null,
        rencanaAksiPencapaianTargetId: item.id,
        realisasiRencanaAksiPegawaiId: rraPegawaiRecord.id,
      })),
    );

    return NextResponse.json(newLangkah[0], { status: 201 });
  } catch (error) {
    console.error(
      "Error creating 'rencana_aksi_pencapaian_langkah' record: ",
      error,
    );
    return NextResponse.json({
      error: "Failed to create 'rencana_aksi_pencapaian_langkah' record",
      status: 500,
    });
  }
}
