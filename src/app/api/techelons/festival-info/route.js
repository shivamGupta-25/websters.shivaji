import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import TechelonsData from '@/models/TechelonsData';

export async function GET() {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Get TechelonsData from MongoDB
    const techelonsData = await TechelonsData.findOne({});
    
    if (!techelonsData) {
      return NextResponse.json({ error: 'TechelonsData not found' }, { status: 404 });
    }
    
    // Extract just the festInfo portion to keep the payload small
    const festInfo = techelonsData.festInfo || {};
    
    return NextResponse.json({
      festInfo
    });
  } catch (error) {
    console.error('Error fetching festival info:', error);
    return NextResponse.json({ error: 'Failed to fetch festival info' }, { status: 500 });
  }
} 