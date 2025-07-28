import db from '@/db';
import {
  cascading,
  indikatorSasaranTarget,
  indikatorTujuanTarget,
  renstra,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
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
