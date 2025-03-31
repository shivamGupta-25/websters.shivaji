import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import TechelonsData from '@/models/TechelonsData';

// GET handler to fetch Techelons data
export async function GET() {
  try {
    await connectToDatabase();

    const techelonsData = await TechelonsData.findOne({});

    if (!techelonsData) {
      return NextResponse.json({ error: 'Techelons data not found' }, { status: 404 });
    }

    return NextResponse.json(techelonsData);
  } catch (error) {
    console.error('Error fetching Techelons data:', error);
    return NextResponse.json({ error: 'Failed to fetch Techelons data' }, { status: 500 });
  }
}

// POST handler to update Techelons data
export async function POST(request) {
  try {
    const body = await request.json();
    await connectToDatabase();

    const techelonsData = await TechelonsData.findOne({});
    let result;

    if (techelonsData) {
      // Update existing document with the entire body
      result = await TechelonsData.findByIdAndUpdate(
        techelonsData._id,
        body,
        { new: true, runValidators: true }
      );
    } else {
      // Create new document
      result = await TechelonsData.create(body);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating Techelons data:', error);
    return NextResponse.json({ error: 'Failed to update Techelons data' }, { status: 500 });
  }
}