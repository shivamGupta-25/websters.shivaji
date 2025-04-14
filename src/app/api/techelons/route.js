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

    // Transform any string-based competitionStructure to object format
    if (body.events && Array.isArray(body.events)) {
      body.events = body.events.map(event => {
        // If competitionStructure exists and is an array of strings, convert to object format
        if (event.competitionStructure && Array.isArray(event.competitionStructure)) {
          const isOldFormat = event.competitionStructure.length > 0 && 
                              typeof event.competitionStructure[0] === 'string';
          
          if (isOldFormat) {
            // Convert to new format
            event.competitionStructure = event.competitionStructure.map((item, index) => ({
              title: `Round ${index + 1}`,
              description: "",
              tasks: [item]
            }));
          }
        } else if (!event.competitionStructure) {
          // Initialize with empty array if doesn't exist
          event.competitionStructure = [];
        }
        
        return event;
      });
    }

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