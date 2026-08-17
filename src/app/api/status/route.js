import dbConnect from '@/lib/db';
import Status from '@/models/Status';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const statuses = await Status.find({}).sort({ status: 1 });
    return NextResponse.json({ success: true, data: statuses });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const statusObj = await Status.create(body);
    return NextResponse.json({ success: true, data: statusObj }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
