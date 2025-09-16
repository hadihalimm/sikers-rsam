import db from '@/db';
import { realisasiRencanaAksi } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (!session) {
      return redirect('/sign-in');
    }
    const userId = session.user.id;
    const records = await db.query.realisasiRencanaAksi.findMany({
      where: eq(realisasiRencanaAksi.userId, userId),
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'realisasi_rencana_aksi' records: ", error);
    return NextResponse.json({
      error: "Failed to fetch all 'realisasi_rencana_aksi' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (!session) {
      return redirect('/sign-in');
    }
    const body = await request.json();
    const { nama, tahun, rencanaAksiId } = body;

    const userId = session.user.id;
    const newRecord = await db
      .insert(realisasiRencanaAksi)
      .values({ nama, tahun, rencanaAksiId, userId })
      .returning();
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'realisasi_rencana_aksi' record: ", error);
    return NextResponse.json({
      error: "Failed to create 'realisasi_rencana_aksi' record",
      status: 500,
    });
  }
}
