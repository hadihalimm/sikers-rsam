import db from '@/db';
import {
  indikatorKinerjaUtamaDetail,
  indikatorSasaran,
  sasaran,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'indikator-kinerja-utama-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'indikator-kinerja-utama-id': indikatorKinerjaUtamaId } =
      await params;
    const records = await db
      .select({
        detail: indikatorKinerjaUtamaDetail,
        indikatorSasaran: indikatorSasaran,
        sasaran: sasaran,
      })
      .from(indikatorKinerjaUtamaDetail)
      .where(
        eq(
          indikatorKinerjaUtamaDetail.indikatorKinerjaUtamaId,
          parseInt(indikatorKinerjaUtamaId),
        ),
      )
      .innerJoin(
        indikatorSasaran,
        eq(indikatorKinerjaUtamaDetail.indikatorSasaranId, indikatorSasaran.id),
      )
      .innerJoin(sasaran, eq(indikatorSasaran.sasaranId, sasaran.id));
    return NextResponse.json(records);
  } catch (error) {
    console.error(
      "Error fetching 'indikator_kinerja_utama_detail' records: ",
      error,
    );
    return NextResponse.json({
      error: "Failed to fetch all 'indikator_kinerja_utama_detail' records",
      status: 500,
    });
  }
}
