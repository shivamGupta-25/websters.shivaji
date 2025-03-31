import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import TechelonsRegistration from '@/models/TechelonsRegistration';

export async function DELETE(request) {
  try {
    // Connect to database
    await connectToDatabase();

    // Delete all registrations
    const result = await TechelonsRegistration.deleteMany({});

    // Check if any documents were deleted
    if (result.deletedCount === 0) {
      return NextResponse.json({
        message: 'No registrations found to delete',
        count: 0
      }, { status: 200 });
    }

    return NextResponse.json({
      message: 'All registrations deleted successfully',
      count: result.deletedCount
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting registrations:', error);
    return NextResponse.json(
      { error: 'Failed to delete registrations', details: error.message },
      { status: 500 }
    );
  }
}