import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import TechelonsRegistration from '@/models/TechelonsRegistration';

/**
 * Handler for GET requests - fetches all registrations
 */
export async function GET() {
  try {
    await connectToDatabase();

    const registrations = await TechelonsRegistration.find({})
      .sort({ registrationDate: -1 })
      .lean(); // Use lean() for better performance when you don't need Mongoose document methods

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

/**
 * Handler for DELETE requests - removes a registration by ID
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const result = await TechelonsRegistration.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Error deleting registration:', error);

    // More specific error handling
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid registration ID format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete registration' },
      { status: 500 }
    );
  }
}