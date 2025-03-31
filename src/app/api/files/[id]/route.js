import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';
import FileUpload from '@/models/FileUpload';

/**
 * Serves a file from the database by its ID
 * @param {Request} request - The incoming request
 * @param {Object} params - Route parameters containing the file ID
 * @returns {NextResponse} - Response with file data or error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid file ID format' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find the file by ID, but only select necessary fields
    const file = await FileUpload.findById(id, 'data contentType originalName');

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Create a response with the file data
    const response = new NextResponse(file.data);

    // Set appropriate content headers
    response.headers.set('Content-Type', file.contentType || 'application/octet-stream');
    response.headers.set('Content-Disposition', `inline; filename="${encodeURIComponent(file.originalName)}"`);

    // Set caching headers
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    response.headers.set('ETag', `"${id}"`);

    return response;
  } catch (error) {
    console.error('Error serving file:', error.message);
    return NextResponse.json(
      { error: 'Internal server error', message: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}