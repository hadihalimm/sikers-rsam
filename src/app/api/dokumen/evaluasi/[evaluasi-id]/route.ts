import db from '@/db';
import { dokumenEvaluasi } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { DokumenEvaluasi } from '@/types/database';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    'evaluasi-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'evaluasi-id': evaluasiId } = await params;
    const record = await db.query.dokumenEvaluasi.findFirst({
      where: eq(dokumenEvaluasi.id, parseInt(evaluasiId)),
    });
    if (!record || !record.file) {
      return NextResponse.json(
        { error: "'dokumen_evaluasi' record not found" },
        { status: 404 },
      );
    }

    if (
      record.mimeType?.includes('image') ||
      record.mimeType?.includes('pdf')
    ) {
      return new Response(Uint8Array.from(record.file), {
        status: 200,
        headers: {
          'Content-Type': record.mimeType ?? 'application/octet-stream',
          'Cache-Control': 'no-cache',
        },
      });
    }
    return new Response(Uint8Array.from(record.file), {
      status: 200,
      headers: {
        'Content-Type': record.mimeType ?? 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(
          record.fileName,
        )}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error("Error fetching 'dokumen_evaluasi' record: ", error);
    return NextResponse.json(
      { error: "Failed to fetch 'dokumen_evaluasi' record" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'evaluasi-id': evaluasiId } = await params;
    const body = await request.json();
    const { nama, base64File, fileName, mimeType } = body;
    const fileBuffer = base64File
      ? Buffer.from(base64File, 'base64')
      : undefined;

    let updatedRecord: Omit<
      DokumenEvaluasi,
      'file' | 'fileName' | 'createdAt' | 'updatedAt' | 'mimeType'
    >[];
    if (fileBuffer) {
      updatedRecord = await db
        .update(dokumenEvaluasi)
        .set({ nama, file: fileBuffer, fileName, mimeType })
        .where(eq(dokumenEvaluasi.id, parseInt(evaluasiId)))
        .returning({
          id: dokumenEvaluasi.id,
          nama: dokumenEvaluasi.nama,
        });
    } else {
      updatedRecord = await db
        .update(dokumenEvaluasi)
        .set({ nama })
        .where(eq(dokumenEvaluasi.id, parseInt(evaluasiId)))
        .returning({
          id: dokumenEvaluasi.id,
          nama: dokumenEvaluasi.nama,
        });
    }

    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error("Error updating 'dokumen_evaluasi' record: ", error);
    return NextResponse.json(
      { error: "Failed to update 'dokumen_evaluasi' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'evaluasi-id': evaluasiId } = await params;

    const deletedRecord = await db
      .delete(dokumenEvaluasi)
      .where(eq(dokumenEvaluasi.id, parseInt(evaluasiId)))
      .returning({
        id: dokumenEvaluasi.id,
        nama: dokumenEvaluasi.nama,
      });
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'dokumen_evaluasi' record not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "'dokumen_evaluasi' record deleted successfully",
      deletedRecord: deletedRecord[0],
    });
  } catch (error) {
    console.error("Error deleting 'dokumen_evaluasi' record: ", error);
    return NextResponse.json(
      { error: "Failed to delete 'dokumen_evaluasi' record" },
      { status: 500 },
    );
  }
}
