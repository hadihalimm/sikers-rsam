import db from '@/db';
import { indikatorKinerjaUtamaDetail } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'indikator-kinerja-utama-id': string;
    'iku-detail-id': string;
  }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'iku-detail-id': indikatorKinerjaUtamaDetailId } = await params;
    const body = await request.json();
    const { baseline, penjelasan, penanggungJawab } = body;

    const updatedRecord = await db
      .update(indikatorKinerjaUtamaDetail)
      .set({ baseline, penjelasan, penanggungJawab })
      .where(
        eq(
          indikatorKinerjaUtamaDetail.id,
          parseInt(indikatorKinerjaUtamaDetailId),
        ),
      )
      .returning();
    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'indikator_kinerja_utama_detail' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error(
      "Error updating 'indikator_kinerja_utama_detail' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to update 'indikator_kinerja_utama_detail' record" },
      { status: 500 },
    );
  }
}
