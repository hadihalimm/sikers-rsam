import db from '@/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const records = await db.query.refProgram.findMany({
      with: {
        refKegiatanList: {
          with: {
            refSubKegiatanList: true,
          },
        },
      },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching 'ref_program' records: ", error);
    return NextResponse.json({
      error: "Failed to fetch all 'ref_program' records",
      status: 500,
    });
  }
}
