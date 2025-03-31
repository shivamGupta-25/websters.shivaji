import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import SiteContent from '@/models/SiteContent';
import { fetchSiteContent } from '@/lib/utils';

/**
 * Handles GET requests to fetch workshop data
 */
export async function GET() {
  try {
    const siteContent = await fetchSiteContent();

    if (!siteContent) {
      return NextResponse.json(
        { error: 'Site content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(siteContent.workshop || {});
  } catch (error) {
    console.error('Error fetching workshop data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workshop data' },
      { status: 500 }
    );
  }
}

/**
 * Handles POST requests to update workshop data
 */
export async function POST(request) {
  try {
    const workshopData = await request.json();

    if (!workshopData) {
      return NextResponse.json(
        { error: 'No workshop data provided' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const siteContent = await SiteContent.findOne({});

    if (!siteContent) {
      return NextResponse.json(
        { error: 'Site content not found' },
        { status: 404 }
      );
    }

    const updatedContent = await SiteContent.findByIdAndUpdate(
      siteContent._id,
      { workshop: workshopData },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedContent.workshop);
  } catch (error) {
    console.error('Error updating workshop:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update workshop' },
      { status: 500 }
    );
  }
}