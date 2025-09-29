import db from '@/db';
import {
  perjanjianKinerja,
  realisasiRencanaAksi,
  rencanaAksi,
} from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { asc, desc, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (session.user.roles?.includes('admin')) {
      const records = await db.query.perjanjianKinerja.findMany({
        orderBy: [asc(perjanjianKinerja.userId), desc(perjanjianKinerja.tahun)],
        with: {
          user: true,
        },
      });
      return NextResponse.json(records);
    }

    const records = await db.query.perjanjianKinerja.findMany({
      where: eq(perjanjianKinerja.userId, session.user.id),
      orderBy: [desc(perjanjianKinerja.tahun)],
      with: {
        user: true,
      },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'perjanjian_kinerja' records: ", error);
    return NextResponse.json({
      error: "Failed to fetch all 'perjanjian_kinerja' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { nama, tahun, userId } = body;
    const newRecord = await db
      .insert(perjanjianKinerja)
      .values({ nama, tahun, userId })
      .returning();

    const newRa = await db
      .insert(rencanaAksi)
      .values({
        nama: `Rencana Aksi - ${nama}`,
        tahun,
        userId,
        perjanjianKinerjaId: newRecord[0].id,
      })
      .returning();

    await db.insert(realisasiRencanaAksi).values({
      nama: `Realisasi Rencana Aksi - ${newRa[0].tahun}`,
      tahun,
      userId,
      rencanaAksiId: newRa[0].id,
    });
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'perjanjian_kinerja' record: ", error);
    return NextResponse.json({
      error: "Failed to create 'perjanjian_kinerja' record",
      status: 500,
    });
  }
}
