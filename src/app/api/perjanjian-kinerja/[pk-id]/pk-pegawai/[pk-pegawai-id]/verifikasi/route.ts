import db from '@/db';
import { perjanjianKinerjaPegawai } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'pk-id': string;
    'pk-pegawai-id': string;
  }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'pk-pegawai-id': pkPegawaiId } = await params;
    const body = await request.json();
    const { status } = body;
    const updatedRecord = await db
      .update(perjanjianKinerjaPegawai)
      .set({ status })
      .where(eq(perjanjianKinerjaPegawai.id, parseInt(pkPegawaiId)))
      .returning();

    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'perjanjian_kinerja_pegawai' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error(
      "Error when doing verification on 'perjanjian_kinerja_pegawai' records: ",
      error,
    );
    return NextResponse.json({
      error:
        "Failed when doing verification on 'perjanjian_kinerja_pegawai' records",
      status: 500,
    });
  }
}
