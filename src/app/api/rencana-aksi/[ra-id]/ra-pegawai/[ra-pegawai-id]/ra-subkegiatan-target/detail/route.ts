import db from '@/db';
import {
  perjanjianKinerjaPegawai,
  perjanjianKinerjaPegawaiProgram,
  refKegiatan,
  refProgram,
  refSubKegiatan,
  rencanaAksiPegawai,
  rencanaAksiSubKegiatanTarget,
  satuan,
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
        perjanjianKinerjaPegawaiProgram,
        satuan,
        refSubKegiatan,
        refKegiatan,
        refProgram,
        rencanaAksiSubKegiatanTarget,
      })
      .from(perjanjianKinerjaPegawaiProgram)
      .innerJoin(
        refSubKegiatan,
        eq(perjanjianKinerjaPegawaiProgram.subKegiatanId, refSubKegiatan.id),
      )
      .innerJoin(refKegiatan, eq(refSubKegiatan.refKegiatanId, refKegiatan.id))
      .innerJoin(refProgram, eq(refKegiatan.refProgramId, refProgram.id))
      .innerJoin(
        perjanjianKinerjaPegawai,
        eq(
          perjanjianKinerjaPegawaiProgram.perjanjianKinerjaPegawaiId,
          perjanjianKinerjaPegawai.id,
        ),
      )
      .innerJoin(
        rencanaAksiPegawai,
        eq(
          perjanjianKinerjaPegawai.id,
          rencanaAksiPegawai.perjanjianKinerjaPegawaiId,
        ),
      )
      .leftJoin(
        rencanaAksiSubKegiatanTarget,
        eq(
          perjanjianKinerjaPegawaiProgram.id,
          rencanaAksiSubKegiatanTarget.perjanjianKinerjaPegawaiProgramId,
        ),
      )
      .leftJoin(satuan, eq(rencanaAksiSubKegiatanTarget.satuanId, satuan.id))
      .where(eq(rencanaAksiPegawai.id, parseInt(raPegawaiId)));
    return NextResponse.json(records);
  } catch (error) {
    console.error(
      "Error fetching 'rencana_aksi_subkegiatan_target' records: ",
      error,
    );
    return NextResponse.json({
      error: "Failed to fetch all 'rencana_aksi_subkegiatan_target' records",
      status: 500,
    });
  }
}
