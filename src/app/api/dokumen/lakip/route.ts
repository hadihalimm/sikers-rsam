import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/user';
import db from '@/db';
import { dokumenLakip } from '@/db/schema';

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const records = await db.query.dokumenLakip.findMany({
      columns: {
        id: true,
        nama: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'dokumen_lakip' records: ", error);
    return NextResponse.json({
      error: "Failed to fetch all 'dokumen_lakip' records",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession(request.headers);
    if (!session || !session.user.roles?.includes('admin'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { nama, base64File, fileName, mimeType } = body;
    const fileBuffer = base64File ? Buffer.from(base64File, 'base64') : null;

    const newRecord = await db
      .insert(dokumenLakip)
      .values({ nama, file: fileBuffer, fileName, mimeType })
      .returning({
        id: dokumenLakip.id,
        nama: dokumenLakip.nama,
      });

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error("Error creating 'dokumen_lakip' record: ", error);
    return NextResponse.json({
      error: "Failed to create 'dokumen_lakip' record",
      status: 500,
    });
  }
}
