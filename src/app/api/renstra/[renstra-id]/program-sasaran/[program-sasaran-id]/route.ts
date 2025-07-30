import db from '@/db';
import { programSasaran } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'renstra-id': string;
    'program-sasaran-id': string;
  }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'program-sasaran-id': programSasaranId } = await params;
    const deletedRecord = await db
      .delete(programSasaran)
      .where(eq(programSasaran.id, parseInt(programSasaranId)))
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'program_sasaran' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'program_sasaran' record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting 'program_sasaran' record: ", error);
    return NextResponse.json(
      { error: "Failed to delete 'program_sasaran' record" },
      { status: 500 },
    );
  }
}
