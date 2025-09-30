import db from '@/db';
import { indikatorTujuan } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'cascading-id': string;
    'tujuan-id': string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'tujuan-id': tujuanId } = await params;
    const body = await request.json();
    const { nama } = body;

    const newRecord = await db
      .insert(indikatorTujuan)
      .values({
        nama,
        tujuanId: parseInt(tujuanId),
      })
      .returning();
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'indikator_tujuan' records: ", error);
    return NextResponse.json({
      error: "Failed to create 'indikator_tujuan' record",
      status: 500,
    });
  }
}
