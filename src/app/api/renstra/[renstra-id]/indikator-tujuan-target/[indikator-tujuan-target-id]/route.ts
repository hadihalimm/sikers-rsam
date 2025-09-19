import db from '@/db';
import { indikatorTujuanTarget } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'renstra-id': string;
    'indikator-tujuan-target-id': string;
  }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getCurrentSession(request.headers);
  if (!session || !session.user.roles?.includes('admin'))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { 'indikator-tujuan-target-id': indikatorTujuanTargetId } =
      await params;
    const body = await request.json();
    const { target } = body;

    const updatedRecord = await db
      .update(indikatorTujuanTarget)
      .set({ target })
      .where(eq(indikatorTujuanTarget.id, parseInt(indikatorTujuanTargetId)))
      .returning();
    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'indikator-tujuan-target' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error("Error updating 'indikator-tujuan-target' record: ", error);
    return NextResponse.json(
      { error: "Failed to update 'indikator-tujuan-target' record" },
      { status: 500 },
    );
  }
}
