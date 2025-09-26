import db from '@/db';
import { dokumenLakip } from '@/db/schema';
import { getCurrentSession } from '@/lib/user';
import { DokumenLakip } from '@/types/database';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
interface RouteParams {
  params: Promise<{
    'lakip-id': string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'lakip-id': lakipId } = await params;
    const record = await db.query.dokumenLakip.findFirst({
      where: eq(dokumenLakip.id, parseInt(lakipId)),
    });
    if (!record || !record.file) {
      return NextResponse.json(
        { error: "'dokumen_lakip' record not found" },
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
    console.error("Error fetching 'dokumen_lakip' record: ", error);
    return NextResponse.json(
      { error: "Failed to fetch 'dokumen_lakip' record" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'lakip-id': lakipId } = await params;
    const body = await request.json();
    const { nama, base64File, fileName, mimeType } = body;
    const fileBuffer = base64File
      ? Buffer.from(base64File, 'base64')
      : undefined;

    let updatedRecord: Omit<
      DokumenLakip,
      'file' | 'fileName' | 'createdAt' | 'updatedAt' | 'mimeType'
    >[];
    if (fileBuffer) {
      updatedRecord = await db
        .update(dokumenLakip)
        .set({ nama, file: fileBuffer, fileName, mimeType })
        .where(eq(dokumenLakip.id, parseInt(lakipId)))
        .returning({
          id: dokumenLakip.id,
          nama: dokumenLakip.nama,
        });
    } else {
      updatedRecord = await db
        .update(dokumenLakip)
        .set({ nama })
        .where(eq(dokumenLakip.id, parseInt(lakipId)))
        .returning({
          id: dokumenLakip.id,
          nama: dokumenLakip.nama,
        });
    }

    return NextResponse.json(updatedRecord[0]);
  } catch (error) {
    console.error("Error updating 'dokumen_lakip' record: ", error);
    return NextResponse.json(
      { error: "Failed to update 'dokumen_lakip' record" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 'lakip-id': lakipId } = await params;

    const deletedRecord = await db
      .delete(dokumenLakip)
      .where(eq(dokumenLakip.id, parseInt(lakipId)))
      .returning({
        id: dokumenLakip.id,
        nama: dokumenLakip.nama,
      });
    if (deletedRecord.length === 0) {
      return NextResponse.json(
        { error: "'dokumen_lakip' record not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "'dokumen_lakip' record deleted successfully",
      deletedRecord: deletedRecord[0],
    });
  } catch (error) {
    console.error("Error deleting 'dokumen_lakip' record: ", error);
    return NextResponse.json(
      { error: "Failed to delete 'dokumen_lakip' record" },
      { status: 500 },
    );
  }
}
