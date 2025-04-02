import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import SponsorsData from '@/models/SponsorsData';

// Default data structure
const DEFAULT_SPONSORS_DATA = {
  sponsors: [],
  categories: {
    general: 'General',
    gold: 'Gold',
    silver: 'Silver',
    bronze: 'Bronze'
  },
  uiContent: {
    title: 'Event Sponsors',
    subtitle: 'Our Incredible Partners',
    description: 'We extend our sincere gratitude to our sponsors who make this event possible. Their support enables us to create an exceptional experience for all participants.',
    showSection: true
  }
};

/**
 * GET handler to fetch Sponsors data
 */
export async function GET() {
  try {
    await connectToDatabase();
    const sponsorsData = await SponsorsData.findOne({});

    return NextResponse.json(sponsorsData || DEFAULT_SPONSORS_DATA);
  } catch (error) {
    console.error('Error fetching Sponsors data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Sponsors data' },
      { status: 500 }
    );
  }
}

/**
 * POST handler to update Sponsors data
 */
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: 'Request body cannot be empty' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const sponsorsData = await SponsorsData.findOne({});

    const result = sponsorsData
      ? await SponsorsData.findByIdAndUpdate(
        sponsorsData._id,
        body,
        { new: true, runValidators: true }
      )
      : await SponsorsData.create(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating Sponsors data:', error);

    // More specific error handling
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update Sponsors data' },
      { status: 500 }
    );
  }
}