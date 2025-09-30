import db from '@/db';
import {
  indikatorSasaran,
  rencanaKinerjaTahunanDetail,
  sasaran,
} from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'rencana-kinerja-tahunan-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'rencana-kinerja-tahunan-id': rencanaKinerjaTahunanId } =
      await params;
    const records = await db
      .select({
        detail: rencanaKinerjaTahunanDetail,
        indikatorSasaran: indikatorSasaran,
        sasaran: sasaran,
      })
      .from(rencanaKinerjaTahunanDetail)
      .where(
        eq(
          rencanaKinerjaTahunanDetail.rencanaKinerjaTahunanId,
          parseInt(rencanaKinerjaTahunanId),
        ),
      )
      .innerJoin(
        indikatorSasaran,
        eq(rencanaKinerjaTahunanDetail.indikatorSasaranId, indikatorSasaran.id),
      )
      .innerJoin(sasaran, eq(indikatorSasaran.sasaranId, sasaran.id));
    return NextResponse.json(records);
  } catch (error) {
    console.error(
      "Error fetching 'rencana_kinerja_tahunan_detail' records: ",
      error,
    );
    return NextResponse.json({
      error: "Failed to fetch all 'rencana_kinerja_tahunan_detail' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'rencana-kinerja-tahunan-id': rencanaKinerjaTahunanId } =
      await params;
    const body = await request.json();
    const { target, indikatorSasaranId } = body;

    const newRecord = await db.insert(rencanaKinerjaTahunanDetail).values({
      target,
      rencanaKinerjaTahunanId: parseInt(rencanaKinerjaTahunanId),
      indikatorSasaranId,
    });
    return NextResponse.json(newRecord);
  } catch (error) {
    console.error(
      "Error creating 'rencana_kinerja_tahunan_detail' record: ",
      error,
    );
    return NextResponse.json({
      error: "Failed to create 'rencana_kinerja_tahunan_detail' record",
      status: 500,
    });
  }
}
