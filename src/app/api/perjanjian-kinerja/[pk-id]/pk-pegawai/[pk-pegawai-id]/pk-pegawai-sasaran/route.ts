import db from '@/db';
import {
  indikatorSasaran,
  perjanjianKinerjaPegawaiSasaran,
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
        detail: perjanjianKinerjaPegawaiSasaran,
        indikatorSasaran: indikatorSasaran,
        sasaran: sasaran,
      })
      .from(perjanjianKinerjaPegawaiSasaran)
      .where(
        eq(
          perjanjianKinerjaPegawaiSasaran.perjanjianKinerjaPegawaiId,
          parseInt(pkPegawaiId),
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
    const { target, modelCapaian, indikatorSasaranId } = body;
    const newRecord = await db
      .insert(perjanjianKinerjaPegawaiSasaran)
      .values({
        target,
        modelCapaian,
        indikatorSasaranId,
        perjanjianKinerjaPegawaiId: parseInt(pkPegawaiId),
      })
      .returning();
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
