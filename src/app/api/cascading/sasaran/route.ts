import db from '@/db';
import { cascading, sasaran, tujuan } from '@/db/schema';
import { and, eq, gte, lte } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const tahun = request.nextUrl.searchParams.get('tahun');
    const records = await db
      .select({
        id: sasaran.id,
        judul: sasaran.judul,
        pengampu: sasaran.pengampu,
        level: sasaran.level,
        tujuanId: sasaran.tujuanId,
        parentId: sasaran.parentId,
      })
      .from(sasaran)
      .innerJoin(tujuan, eq(sasaran.tujuanId, tujuan.id))
      .innerJoin(cascading, eq(tujuan.cascadingId, cascading.id))
      .where(
        and(
          lte(cascading.tahunMulai, Number(tahun)),
          gte(cascading.tahunBerakhir, Number(tahun)),
        ),
      );
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'sasaran' records: ", error);
    return NextResponse.json({
      error: "Failed to fetch 'sasaran' records",
      status: 500,
    });
  }
}
