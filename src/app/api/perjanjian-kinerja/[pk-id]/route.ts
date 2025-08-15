import db from '@/db';
import { perjanjianKinerja } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'pk-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'pk-id': pkId } = await params;
    const record = await db.query.perjanjianKinerja.findFirst({
      where: eq(perjanjianKinerja.id, parseInt(pkId)),
    });
    if (!record) {
      return NextResponse.json(
        { error: "'perjanjian_kinerja' record not found" },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error("Error fetching 'perjanjian_kinerja' record: ", error);
    return NextResponse.json(
      { error: "Failed to fetch 'perjanjian_kinerja' record" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'pk-id': pkId } = await params;
    const body = await request.json();
    const { nama } = body;

    const updatedRecord = await db
      .update(perjanjianKinerja)
      .set({ nama })
      .where(eq(perjanjianKinerja.id, parseInt(pkId)))
      .returning();

    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'perjanjian_kinerja' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error("Error updating 'perjanjian_kinerja' record: ", error);
    return NextResponse.json(
      { error: "Failed to update 'perjanjian_kinerja' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'pk-id': pkId } = await params;

    const deletedRecord = await db
      .delete(perjanjianKinerja)
      .where(eq(perjanjianKinerja.id, parseInt(pkId)))
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'perjanjian_kinerja' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'perjanjian_kinerja' record deleted successfully",
      deletedRecord: deletedRecord[0],
    });
  } catch (error) {
    console.error("Error deleting 'perjanjian_kinerja' record: ", error);
    return NextResponse.json(
      { error: "Failed to delete 'perjanjian_kinerja' record" },
      { status: 500 },
    );
  }
}
