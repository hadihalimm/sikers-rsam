import db from '@/db';
import { refProgram } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'ref-program-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ref-program-id': refProgramId } = await params;
    const record = await db.query.refProgram.findFirst({
      where: eq(refProgram.id, parseInt(refProgramId)),
    });
    if (!record) {
      return NextResponse.json(
        { error: "'ref_program' record not found" },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error("Error fetching 'ref_program' record: ", error);
    return NextResponse.json(
      { error: "Failed to fetch 'ref_program' record" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ref-program-id': refProgramId } = await params;
    const body = await request.json();
    const { nama } = body;

    const updatedRecord = await db
      .update(refProgram)
      .set({ nama })
      .where(eq(refProgram.id, parseInt(refProgramId)))
      .returning();

    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'ref_program' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error("Error updating 'ref_program' record: ", error);
    return NextResponse.json(
      { error: "Failed to update 'ref_program' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'ref-program-id': refProgramId } = await params;

    const deletedRecord = await db
      .delete(refProgram)
      .where(eq(refProgram.id, parseInt(refProgramId)))
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'ref_program' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'ref_program' record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting 'ref_program' record: ", error);
    return NextResponse.json(
      { error: "Failed to delete 'ref_program' record" },
      { status: 500 },
    );
  }
}
