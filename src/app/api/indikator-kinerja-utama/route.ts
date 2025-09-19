import db from '@/db';
import {
  cascading,
  indikatorKinerjaUtama,
  indikatorKinerjaUtamaDetail,
} from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const records = await db.query.indikatorKinerjaUtama.findMany({
      with: {
        cascading: true,
      },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'indikator_kinerja_utama' records: ", error);
    return NextResponse.json({
      error: "Failed to fetch all 'indikator_kinerja_utama' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { nama, cascadingId } = body;

    const newIku = await db
      .insert(indikatorKinerjaUtama)
      .values({
        nama,
        cascadingId,
      })
      .returning();

    const cascadingRecord = await db.query.cascading.findFirst({
      where: eq(cascading.id, cascadingId),
      with: {
        tujuanList: {
          with: {
            sasaranList: {
              where: (sasaran) => eq(sasaran.level, 1),
              with: {
                indikatorSasaranList: true,
              },
            },
          },
        },
      },
    });

    if (!cascadingRecord) {
      return NextResponse.json(
        { error: "related 'cascading' record not found" },
        { status: 404 },
      );
    }
    for (const tujuan of cascadingRecord.tujuanList) {
      for (const sasaran of tujuan.sasaranList) {
        for (const indikatorSasaran of sasaran.indikatorSasaranList) {
          await db.insert(indikatorKinerjaUtamaDetail).values({
            indikatorSasaranId: indikatorSasaran.id,
            indikatorKinerjaUtamaId: newIku[0].id,
          });
        }
      }
    }
    return NextResponse.json(newIku);
  } catch (error) {
    console.error("Error creating 'indikator_kinerja_utama' record: ", error);
    return NextResponse.json({
      error: "Failed to create 'indikator_kinerja_utama' record",
      status: 500,
    });
  }
}
