import db from '@/db';
import {
  indikatorKinerjaUtama,
  indikatorKinerjaUtamaDetail,
} from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'indikator-kinerja-utama-id': string;
    'iku-detail-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'iku-detail-id': indikatorKinerjaUtamaDetailId } = await params;
    const record = await db.query.indikatorKinerjaUtamaDetail.findFirst({
      where: eq(
        indikatorKinerjaUtamaDetail.id,
        parseInt(indikatorKinerjaUtamaDetailId),
      ),
    });
    if (!record) {
      return NextResponse.json(
        { error: "'indikator_kinerja_utama_detail' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error(
      "Error fetching 'indikator_kinerja_utama_detail' record: ",
      error,
    );
    return NextResponse.json(
      { error: "Failed to fetch 'indikator_kinerja_utama_detail' record" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const {
      'indikator-kinerja-utama-id': indikatorKinerjaUtamaId,
      'iku-detail-id': indikatorKinerjaUtamaDetailId,
    } = await params;
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

    await db
      .update(indikatorKinerjaUtama)
      .set({ updatedAt: new Date() })
      .where(eq(indikatorKinerjaUtama.id, parseInt(indikatorKinerjaUtamaId)));

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
