import db from '@/db';
import { renstra, tujuan } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'renstra-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'renstra-id': renstraId } = await params;
    const cascadingRecord = await db.query.renstra.findFirst({
      columns: {
        cascadingId: true,
      },
      where: eq(renstra.id, parseInt(renstraId)),
    });
    if (!cascadingRecord) {
      return NextResponse.json(
        { error: "related 'cascading' record not found" },
        { status: 404 },
      );
    }

    const record = await db.query.tujuan.findMany({
      where: eq(tujuan.cascadingId, cascadingRecord.cascadingId),
      with: {
        indikatorTujuanList: {
          with: {
            indikatorTujuanTargetList: {
              where: (target) => eq(target.renstraId, parseInt(renstraId)),
            },
          },
        },
        sasaranList: {
          with: {
            indikatorSasaranList: {
              with: {
                indikatorSasaranTargetList: {
                  where: (target) => eq(target.renstraId, parseInt(renstraId)),
                  orderBy: (target, { asc }) => [asc(target.tahun)],
                },
              },
            },
            programSasaranList: {
              with: {
                program: {
                  with: {
                    kegiatanList: {
                      with: { subKegiatanList: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error("Error fetching 'renstra' record: ", error);
    return NextResponse.json(
      { error: "Failed to fetch 'renstra' record" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'renstra-id': renstraId } = await params;
    if (isNaN(parseInt(renstraId))) {
      return NextResponse.json(
        { error: 'Invalid ID format. IDs must be integer.' },
        { status: 400 },
      );
    }
    const body = await request.json();
    const { judul } = body;

    const updatedRecord = await db
      .update(renstra)
      .set({ judul })
      .where(eq(renstra.id, parseInt(renstraId)))
      .returning();

    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: "'renstra' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error("Error updating 'renstra' record: ", error);
    return NextResponse.json(
      { error: "Failed to update 'renstra' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { 'renstra-id': renstraId } = await params;
    if (isNaN(parseInt(renstraId))) {
      return NextResponse.json(
        { error: 'Invalid ID format. IDs must be integer.' },
        { status: 400 },
      );
    }

    const deletedRecord = await db
      .delete(renstra)
      .where(eq(renstra.id, parseInt(renstraId)))
      .returning();
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'renstra' record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      message: "'renstra' record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting 'renstra' record: ", error);
    return NextResponse.json(
      { error: "Failed to delete 'renstra' record" },
      { status: 500 },
    );
  }
}
