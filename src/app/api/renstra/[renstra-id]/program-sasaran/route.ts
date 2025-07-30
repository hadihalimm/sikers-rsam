import db from '@/db';
import { kegiatan, program, programSasaran, subKegiatan } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'renstra-id': string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'renstra-id': renstraId } = await params;
    const body = await request.json();
    const {
      sasaranId,
      refProgramId,
      refKegiatanId,
      refSubKegiatanIds,
    }: {
      sasaranId: number;
      refProgramId: number;
      refKegiatanId: number;
      refSubKegiatanIds: number[];
    } = body;

    const newProgramSasaran = await db
      .insert(programSasaran)
      .values({
        renstraId: parseInt(renstraId),
        sasaranId,
      })
      .returning();
    const newProgram = await db
      .insert(program)
      .values({ programSasaranId: newProgramSasaran[0].id, refProgramId })
      .returning();

    const newKegiatan = await db
      .insert(kegiatan)
      .values({ refKegiatanId, programId: newProgram[0].id })
      .returning();
    refSubKegiatanIds.map(async (id) => {
      await db
        .insert(subKegiatan)
        .values({ refSubKegiatanId: id, kegiatanId: newKegiatan[0].id });
    });
    return NextResponse.json(newProgram[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'program_sasaran' record: ", error);
    return NextResponse.json({
      error: "Failed to create 'program_sasaran' record",
      status: 500,
    });
  }
}
