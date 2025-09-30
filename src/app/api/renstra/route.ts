import db from '@/db';
import {
  cascading,
  indikatorSasaranTarget,
  indikatorTujuanTarget,
  renstra,
} from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const records = await db.query.renstra.findMany({
      with: {
        cascading: true,
      },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'renstra' records: ", error);
    return NextResponse.json({
      error: "Failed to fetch all 'renstra' records",
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
    const { judul, cascadingId } = body;
    const newRecord = await db
      .insert(renstra)
      .values({
        judul,
        cascadingId,
      })
      .returning();

    const cascadingRecord = await db.query.cascading.findFirst({
      where: eq(cascading.id, cascadingId),
      with: {
        tujuanList: {
          with: {
            indikatorTujuanList: true,
            sasaranList: {
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
      for (const indikator of tujuan.indikatorTujuanList) {
        await db.insert(indikatorTujuanTarget).values({
          indikatorTujuanId: indikator.id,
          renstraId: newRecord[0].id,
        });
      }
      for (const sasaran of tujuan.sasaranList) {
        for (const indikator of sasaran.indikatorSasaranList) {
          for (
            let i = cascadingRecord.tahunMulai;
            i <= cascadingRecord.tahunBerakhir;
            i++
          ) {
            await db.insert(indikatorSasaranTarget).values({
              tahun: i,
              indikatorSasaranId: indikator.id,
              renstraId: newRecord[0].id,
            });
          }
        }
      }
    }

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'renstra' record: ", error);
    return NextResponse.json({
      error: "Failed to create 'renstra' record",
      status: 500,
    });
  }
}
