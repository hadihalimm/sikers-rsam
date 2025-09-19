import db from '@/db';
import { indikatorSasaran } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'sasaran-id': string;
    'indikator-sasaran-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const {
      'sasaran-id': sasaranId,
      'indikator-sasaran-id': indikatorSasaranId,
    } = await params;

    if (isNaN(parseInt(sasaranId)) || isNaN(parseInt(indikatorSasaranId))) {
      return NextResponse.json(
        { error: 'Invalid ID format. IDs must be integer.' },
        { status: 400 },
      );
    }

    const record = await db.query.indikatorSasaran.findFirst({
      where: and(
        eq(indikatorSasaran.id, parseInt(indikatorSasaranId)),
        eq(indikatorSasaran.sasaranId, parseInt(sasaranId)),
      ),
    });
    if (!record) {
      return NextResponse.json(
        { error: "'indikator_tujuan' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error("Error fetching 'indikator_sasaran' record: ", error);
    return NextResponse.json(
      { error: "Failed to fetch 'indikator_sasaran' record" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const {
      'sasaran-id': sasaranId,
      'indikator-sasaran-id': indikatorSasaranId,
    } = await params;

    if (isNaN(parseInt(sasaranId)) || isNaN(parseInt(indikatorSasaranId))) {
      return NextResponse.json(
        { error: 'Invalid ID format. IDs must be integer.' },
        { status: 400 },
      );
    }
    const body = await request.json();
    const { nama } = body;

    const updatedRecord = await db
      .update(indikatorSasaran)
      .set({ nama })
      .where(
        and(
          eq(indikatorSasaran.id, parseInt(indikatorSasaranId)),
          eq(indikatorSasaran.sasaranId, parseInt(sasaranId)),
        ),
      )
      .returning();

    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'indikator_sasaran' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error("Error updating 'indikator_sasaran' record: ", error);
    return NextResponse.json(
      { error: "Failed to update 'indikator_sasaran' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const {
      'sasaran-id': sasaranId,
      'indikator-sasaran-id': indikatorSasaranId,
    } = await params;
    if (isNaN(parseInt(sasaranId)) || isNaN(parseInt(indikatorSasaranId))) {
      return NextResponse.json(
        { error: 'Invalid ID format. IDs must be integer.' },
        { status: 400 },
      );
    }

    const deletedRecord = await db
      .delete(indikatorSasaran)
      .where(
        and(
          eq(indikatorSasaran.id, parseInt(indikatorSasaranId)),
          eq(indikatorSasaran.sasaranId, parseInt(sasaranId)),
        ),
      )
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'indikator_sasaran' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'indikator_sasaran' record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting 'indikator_sasaran' record: ", error);
    return NextResponse.json(
      { error: "Failed to delete 'indikator_sasaran' record" },
      { status: 500 },
    );
  }
}
