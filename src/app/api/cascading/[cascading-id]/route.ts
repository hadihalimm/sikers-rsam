import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import db from '@/db';
import { cascading } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';

interface RouteParams {
  params: Promise<{
    'cascading-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'cascading-id': cascadingId } = await params;

    const record = await db
      .select()
      .from(cascading)
      .where(eq(cascading.id, parseInt(cascadingId)));

    if (record.length === 0) {
      return NextResponse.json(
        { error: "'cascading' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(record[0]);
  } catch (error) {
    console.error("Error fetching 'cascading' record: ", error);
    return NextResponse.json(
      { error: "Failed to fetch 'cascading' record" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'cascading-id': cascadingId } = await params;
    const recordId = parseInt(cascadingId);
    const body = await request.json();
    const { judul, tahunMulai, tahunBerakhir } = body;

    const updatedRecord = await db
      .update(cascading)
      .set({
        judul,
        tahunMulai,
        tahunBerakhir,
        updatedAt: new Date(),
      })
      .where(eq(cascading.id, recordId))
      .returning();

    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'cascading' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error("Error updating 'cascading' record: ", error);
    return NextResponse.json(
      { error: "Failed to update 'cascading' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'cascading-id': cascadingId } = await params;
    const recordId = parseInt(cascadingId);

    const deletedRecord = await db
      .delete(cascading)
      .where(eq(cascading.id, recordId))
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'cascading' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'cascading' record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting 'cascading' record: ", error);
    if (error instanceof Error && error.message.includes('foreign key')) {
      return NextResponse.json(
        {
          error:
            "Cannot delete 'cascading' record because it is still referenced by other records",
        },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Failed to delete 'cascading' record" },
      { status: 500 },
    );
  }
}
