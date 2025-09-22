import db from '@/db';
import {
  cascading,
  indikatorKinerjaUtama,
  indikatorKinerjaUtamaDetail,
  indikatorSasaran,
  indikatorSasaranTarget,
  renstra,
  sasaran,
  tujuan,
} from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'sasaran-id': string;
    'tujuan-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'sasaran-id': sasaranId } = await params;
    const records = await db.query.indikatorSasaran.findMany({
      where: eq(indikatorSasaran.sasaranId, parseInt(sasaranId)),
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'indikator_sasaran' records: ", error);
    return NextResponse.json({
      error:
        "Failed to fetch all 'indikator_sasaran' records for given 'sasaranId'",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'sasaran-id': sasaranId } = await params;
    const body = await request.json();
    const { nama } = body;

    const newRecord = await db
      .insert(indikatorSasaran)
      .values({ nama, sasaranId: parseInt(sasaranId) })
      .returning();

    const sasaranRecord = await db.query.sasaran.findFirst({
      where: eq(sasaran.id, parseInt(sasaranId)),
    });

    if (sasaranRecord?.level === 1) {
      const cascadingRecord = await db
        .selectDistinctOn([cascading.id], {
          id: cascading.id,
          tahunMulai: cascading.tahunMulai,
          tahunBerakhir: cascading.tahunBerakhir,
        })
        .from(sasaran)
        .where(eq(sasaran.id, parseInt(sasaranId)))
        .innerJoin(tujuan, eq(sasaran.tujuanId, tujuan.id))
        .innerJoin(cascading, eq(tujuan.cascadingId, cascading.id));

      const renstraRecords = await db.query.renstra.findMany({
        where: eq(renstra.cascadingId, cascadingRecord[0].id),
      });

      await Promise.all(
        renstraRecords.map((renstra) =>
          Promise.all(
            Array.from(
              {
                length:
                  cascadingRecord[0].tahunBerakhir -
                  cascadingRecord[0].tahunMulai +
                  1,
              },
              (_, idx) => {
                const tahun = cascadingRecord[0].tahunMulai + idx;
                return db.insert(indikatorSasaranTarget).values({
                  tahun,
                  indikatorSasaranId: newRecord[0].id,
                  renstraId: renstra.id,
                });
              },
            ),
          ),
        ),
      );

      const indikatorKinerjaUtamaRecords =
        await db.query.indikatorKinerjaUtama.findMany({
          where: eq(indikatorKinerjaUtama.cascadingId, cascadingRecord[0].id),
        });

      await Promise.all(
        indikatorKinerjaUtamaRecords.map((item) =>
          db.insert(indikatorKinerjaUtamaDetail).values({
            indikatorKinerjaUtamaId: item.id,
            indikatorSasaranId: newRecord[0].id,
          }),
        ),
      );
    }

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'indikator_sasaran' record: ", error);
    return NextResponse.json({
      error: "Failed to create 'indikator_sasaran' record",
      status: 500,
    });
  }
}
