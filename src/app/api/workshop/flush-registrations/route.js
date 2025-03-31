import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import WorkshopRegistration from '@/models/WorkshopRegistration';
import { cookies } from 'next/headers';

/**
 * API handler for deleting all workshop registrations
 * Requires admin authentication
 */
export async function DELETE() {
  try {
    // Verify admin authentication
    const cookieStore = cookies();
    const adminCookie = cookieStore.get('admin_session');

    if (!adminCookie?.value) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Delete all workshop registrations
    const result = await WorkshopRegistration.deleteMany({});

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} workshop registrations`,
      deletedCount: result.deletedCount
    }, { status: 200 });
  } catch (error) {
    console.error('Error flushing workshop registration data:', error);

    return NextResponse.json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}