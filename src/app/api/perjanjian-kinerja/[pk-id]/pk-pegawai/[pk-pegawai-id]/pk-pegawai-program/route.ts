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
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'pk-pegawai-id': pkPegawaiId } = await params;
    const records = await db
      .select({
        pkPegawaiProgram: perjanjianKinerjaPegawaiProgram,
        pkPegawaiProgramDetail: perjanjianKinerjaPegawaiProgramDetail,
        sasaran: sasaran,
        programDetail: {
          programNama: refProgram.nama,
          kegiatanNama: refKegiatan.nama,
          subKegiatanNama: refSubKegiatan.nama,
        },
      })
      .from(perjanjianKinerjaPegawaiProgram)
      .where(
        eq(
          perjanjianKinerjaPegawaiProgram.perjanjianKinerjaPegawaiId,
          parseInt(pkPegawaiId),
        ),
      )
      .leftJoin(
        perjanjianKinerjaPegawaiProgramDetail,
        eq(
          perjanjianKinerjaPegawaiProgramDetail.perjanjianKinerjaPegawaiProgramId,
          perjanjianKinerjaPegawaiProgram.id,
        ),
      )
      .leftJoin(
        sasaran,
        eq(perjanjianKinerjaPegawaiProgram.sasaranId, sasaran.id),
      )
      .leftJoin(
        refSubKegiatan,
        eq(
          perjanjianKinerjaPegawaiProgramDetail.subKegiatanId,
          refSubKegiatan.id,
        ),
      )
      .leftJoin(refKegiatan, eq(refSubKegiatan.refKegiatanId, refKegiatan.id))
      .leftJoin(refProgram, eq(refKegiatan.refProgramId, refProgram.id));
    return NextResponse.json(records);
  } catch (error) {
    console.error(
      "Error fetching 'perjanjian_kinerja_pegawai_program' records: ",
      error,
    );
    return NextResponse.json({
      error: "Failed to fetch all 'perjanjian_kinerja_pegawai_program' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'pk-pegawai-id': pkPegawaiId } = await params;
    const body = await request.json();
    const { sasaranId } = body;
    const record = await db.query.perjanjianKinerjaPegawaiProgram.findFirst({
      where: eq(perjanjianKinerjaPegawaiProgram.sasaranId, parseInt(sasaranId)),
    });
    if (record) {
      return NextResponse.json(record, { status: 200 });
    }

    const newRecord = await db
      .insert(perjanjianKinerjaPegawaiProgram)
      .values({
        sasaranId,
        perjanjianKinerjaPegawaiId: parseInt(pkPegawaiId),
      })
      .returning();
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error(
      "Error creating 'perjanjian_kinerja_pegawai_program' record: ",
      error,
    );
    return NextResponse.json({
      error: "Failed to create 'perjanjian_kinerja_pegawai_program' record",
      status: 500,
    });
  }
}
