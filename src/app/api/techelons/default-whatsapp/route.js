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
    
    // Get default WhatsApp group link
    let defaultWhatsappGroup = '';
    if (techelonsData.whatsappGroups) {
      // Check if it's a Map object
      if (techelonsData.whatsappGroups instanceof Map) {
        defaultWhatsappGroup = techelonsData.whatsappGroups.get('default') || '';
      } else {
        // Treat as a plain object
        defaultWhatsappGroup = techelonsData.whatsappGroups.default || '';
      }
    }
    
    return NextResponse.json({
      defaultWhatsappGroup
    });
  } catch (error) {
    console.error('Error fetching default WhatsApp group:', error);
    return NextResponse.json({ error: 'Failed to fetch default WhatsApp group' }, { status: 500 });
  }
} 