import db from '@/db';
import { programSasaran, renstra } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
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
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'renstra-id': renstraId, 'program-sasaran-id': programSasaranId } =
      await params;
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

    await db
      .update(renstra)
      .set({ updatedAt: new Date() })
      .where(eq(renstra.id, parseInt(renstraId)));

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
