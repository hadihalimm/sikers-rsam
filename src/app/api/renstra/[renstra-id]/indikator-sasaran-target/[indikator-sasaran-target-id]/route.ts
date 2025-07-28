import { NextRequest, NextResponse } from 'next/server';
import db from '@/db';
import { indikatorSasaranTarget } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface RouteParams {
  params: Promise<{
    'renstra-id': string;
    'indikator-sasaran-target-id': string;
  }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'indikator-sasaran-target-id': indikatorSasaranTargetId } =
      await params;
    const body = await request.json();
    const { target } = body;

    const updatedRecord = await db
      .update(indikatorSasaranTarget)
      .set({ target })
      .where(eq(indikatorSasaranTarget.id, parseInt(indikatorSasaranTargetId)))
      .returning();
    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'indikator-sasaran-target' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error("Error updating 'indikator-sasaran-target' record: ", error);
    return NextResponse.json(
      { error: "Failed to update 'indikator-sasaran-target' record" },
      { status: 500 },
    );
  }
}
