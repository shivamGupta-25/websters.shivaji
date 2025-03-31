import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import FileUpload from '@/models/FileUpload';
import crypto from 'crypto';

export async function POST(request) {
  try {
    // Connect to database first to fail fast if connection issues exist
    await connectToDatabase();

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Get file metadata
    const originalName = file.name;
    const contentType = file.type;
    const extension = originalName.split('.').pop().toLowerCase();

    // Validate file type
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];
    if (!allowedExtensions.includes(extension)) {
      return NextResponse.json(
        { error: 'File type not allowed. Only images and PDFs are supported.' },
        { status: 400 }
      );
    }

    // Get file data as buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate a unique filename with timestamp for better uniqueness
    const timestamp = Date.now();
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const fileName = `${timestamp}-${uniqueId}.${extension}`;

    // Get section with validation
    const section = formData.get('section') || 'misc';

    // Store the file in MongoDB
    const fileUpload = await FileUpload.create({
      filename: fileName,
      originalName,
      contentType,
      section,
      size: buffer.length,
      uploadDate: new Date(),
      data: buffer
    });

    const fileId = fileUpload._id.toString();

    return NextResponse.json({
      success: true,
      url: `/api/files/${fileId}`,
      fileId,
      filename: originalName
    });
  } catch (error) {
    console.error('Error uploading file:', error.message);

    return NextResponse.json(
      { error: 'Failed to upload file', message: error.message },
      { status: 500 }
    );
  }
}