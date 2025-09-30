import db from '@/db';
import {
  perjanjianKinerjaPegawaiProgram,
  perjanjianKinerjaPegawaiSasaran,
  refKegiatan,
  refProgram,
  refSubKegiatan,
  sasaran,
} from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'pk-id': string;
    'pk-pegawai-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'pk-pegawai-id': pkPegawaiId } = await params;
    const records = await db
      .select({
        pkPegawaiProgram: perjanjianKinerjaPegawaiProgram,
        pkPegawaiSasaran: perjanjianKinerjaPegawaiSasaran,
        sasaran: sasaran,
        program: refProgram,
        kegiatan: refKegiatan,
        subKegiatan: refSubKegiatan,
      })
      .from(perjanjianKinerjaPegawaiProgram)
      .where(
        eq(
          perjanjianKinerjaPegawaiProgram.perjanjianKinerjaPegawaiId,
          parseInt(pkPegawaiId),
        ),
      )
      .innerJoin(
        perjanjianKinerjaPegawaiSasaran,
        eq(
          perjanjianKinerjaPegawaiProgram.perjanjianKinerjaPegawaiSasaranId,
          perjanjianKinerjaPegawaiSasaran.id,
        ),
      )
      .leftJoin(
        sasaran,
        eq(perjanjianKinerjaPegawaiProgram.sasaranId, sasaran.id),
      )
      .leftJoin(
        refSubKegiatan,
        eq(perjanjianKinerjaPegawaiProgram.subKegiatanId, refSubKegiatan.id),
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
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'pk-pegawai-id': pkPegawaiId } = await params;
    const body = await request.json();
    const { sasaranId, pkPegawaiSasaranId, anggaran, subKegiatanId } = body;
    const record = await db.query.perjanjianKinerjaPegawaiProgram.findFirst({
      where: and(
        eq(
          perjanjianKinerjaPegawaiProgram.perjanjianKinerjaPegawaiId,
          parseInt(pkPegawaiId),
        ),
        eq(perjanjianKinerjaPegawaiProgram.sasaranId, parseInt(sasaranId)),
      ),
    });
    if (record && !subKegiatanId) return NextResponse.json({ status: 201 });
    if (record) {
      const newRecord = await db
        .insert(perjanjianKinerjaPegawaiProgram)
        .values({
          sasaranId,
          anggaran,
          subKegiatanId,
          perjanjianKinerjaPegawaiSasaranId: parseInt(pkPegawaiSasaranId),
          perjanjianKinerjaPegawaiId: parseInt(pkPegawaiId),
        })
        .returning();
      return NextResponse.json(newRecord[0], { status: 201 });
    } else {
      const newRecord = await db
        .insert(perjanjianKinerjaPegawaiProgram)
        .values({
          sasaranId,
          anggaran,
          perjanjianKinerjaPegawaiSasaranId: parseInt(pkPegawaiSasaranId),
          perjanjianKinerjaPegawaiId: parseInt(pkPegawaiId),
        })
        .returning();
      return NextResponse.json(newRecord[0], { status: 201 });
    }
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
