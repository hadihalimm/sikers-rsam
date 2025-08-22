import db from '@/db';
import {
  perjanjianKinerjaPegawaiProgram,
  perjanjianKinerjaPegawaiProgramDetail,
  refKegiatan,
  refProgram,
  refSubKegiatan,
  sasaran,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'pk-id': string;
    'pk-pegawai-id': string;
    'pk-pegawai-program-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'pk-pegawai-program-id': pkPegawaiProgramId } = await params;
    const records = await db
      .select({
        detail: perjanjianKinerjaPegawaiProgramDetail,
        pkPegawaiProgram: perjanjianKinerjaPegawaiProgram,
        sasaran: sasaran,
        programDetail: {
          programNama: refProgram.nama,
          kegiatanNama: refKegiatan.nama,
          subKegiatanNama: refSubKegiatan.nama,
        },
      })
      .from(perjanjianKinerjaPegawaiProgramDetail)
      .where(
        eq(
          perjanjianKinerjaPegawaiProgramDetail.perjanjianKinerjaPegawaiProgramId,
          parseInt(pkPegawaiProgramId),
        ),
      )
      .innerJoin(
        perjanjianKinerjaPegawaiProgram,
        eq(
          perjanjianKinerjaPegawaiProgramDetail.perjanjianKinerjaPegawaiProgramId,
          perjanjianKinerjaPegawaiProgram.id,
        ),
      )
      .innerJoin(
        sasaran,
        eq(perjanjianKinerjaPegawaiProgram.sasaranId, sasaran.id),
      )
      .innerJoin(
        refSubKegiatan,
        eq(
          perjanjianKinerjaPegawaiProgramDetail.subKegiatanId,
          refSubKegiatan.id,
        ),
      )
      .innerJoin(refKegiatan, eq(refSubKegiatan.refKegiatanId, refKegiatan.id))
      .innerJoin(refProgram, eq(refKegiatan.refProgramId, refProgram.id));
    return NextResponse.json(records);
  } catch (error) {
    console.error(
      "Error fetching 'perjanjian_kinerja_pegawai_program_detail' records: ",
      error,
    );
    return NextResponse.json({
      error:
        "Failed to fetch all 'perjanjian_kinerja_pegawai_program_detail' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'pk-pegawai-program-id': pkPegawaiProgramId } = await params;
    const body = await request.json();
    const { subKegiatanId, anggaran } = body;
    const newRecord = await db
      .insert(perjanjianKinerjaPegawaiProgramDetail)
      .values({
        subKegiatanId,
        anggaran,
        perjanjianKinerjaPegawaiProgramId: parseInt(pkPegawaiProgramId),
      })
      .returning();
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error(
      "Error creating 'perjanjian_kinerja_pegawai_program_detail' record: ",
      error,
    );
    return NextResponse.json({
      error:
        "Failed to create 'perjanjian_kinerja_pegawai_program_detail' record",
      status: 500,
    });
  }
}
