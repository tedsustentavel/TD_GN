import dbConnect from '@/lib/db';
import Tag from '@/models/Tag';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const tags = await Tag.find({}).sort({ tag: 1 });
    return NextResponse.json({ success: true, data: tags });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const tagObj = await Tag.create(body);
    return NextResponse.json({ success: true, data: tagObj }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
