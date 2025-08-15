import db from '@/db';
import {
  perjanjianKinerjaPegawaiProgram,
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
        detail: perjanjianKinerjaPegawaiProgram,
        sasaran: sasaran,
        subKegiatan: refSubKegiatan,
        kegiatan: refKegiatan,
        program: refProgram,
      })
      .from(perjanjianKinerjaPegawaiProgram)
      .where(
        eq(
          perjanjianKinerjaPegawaiProgram.perjanjianKinerjaPegawaiId,
          parseInt(pkPegawaiId),
        ),
      )
      .innerJoin(
        sasaran,
        eq(perjanjianKinerjaPegawaiProgram.sasaranId, sasaran.id),
      )
      .innerJoin(
        refSubKegiatan,
        eq(perjanjianKinerjaPegawaiProgram.subKegiatanId, refSubKegiatan.id),
      )
      .innerJoin(refKegiatan, eq(refSubKegiatan.refKegiatanId, refKegiatan.id))
      .innerJoin(refProgram, eq(refKegiatan.refProgramId, refProgram.id));
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
    const { subKegiatanId, anggaran, sasaranId } = body;
    const newRecord = await db
      .insert(perjanjianKinerjaPegawaiProgram)
      .values({
        subKegiatanId,
        anggaran,
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
