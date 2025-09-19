import db from '@/db';
import { indikatorSasaran } from '@/db/schema';
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
    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'indikator_sasaran' record: ", error);
    return NextResponse.json({
      error: "Failed to create 'indikator_sasaran' record",
      status: 500,
    });
  }
}
