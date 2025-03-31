import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import FileUpload from '@/models/FileUpload';
import SiteContent from '@/models/SiteContent';
import TechelonsData from '@/models/TechelonsData';
import TechelonsRegistration from '@/models/TechelonsRegistration';
import WorkshopRegistration from '@/models/WorkshopRegistration';
import mongoose from 'mongoose';

// Fields likely to contain file references
const FILE_REFERENCE_FIELDS = [
  'fileId', 'file', 'documentId', 'imageId', 'image', 'photo',
  'attachment', 'logo', 'logoImage', 'bannerImage', 'document',
  'collegeId', 'idProof', 'profilePicture', 'avatar'
];

/**
 * Recursively check objects and arrays for file ID references
 * @param {Object|Array} obj - Object to check for file references
 * @param {Map} fileUsageMap - Map tracking file usage status
 */
function checkFieldsForFileIds(obj, fileUsageMap) {
  if (!obj) return;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      checkFieldsForFileIds(item, fileUsageMap);
    }
    return;
  }

  if (typeof obj === 'object' && obj !== null) {
    // Check if this object has an ID that matches a file ID
    if (obj._id) {
      const id = obj._id.toString();
      if (fileUsageMap.has(id)) {
        fileUsageMap.set(id, true);
      }
    }

    // Check each field in the object
    for (const [key, value] of Object.entries(obj)) {
      // If it's a field likely to contain file references
      if (FILE_REFERENCE_FIELDS.includes(key) && typeof value === 'string') {
        // Check if the value is a file ID
        if (fileUsageMap.has(value)) {
          fileUsageMap.set(value, true);
          continue;
        }

        // Check if the value contains a file ID (e.g., /api/files/123456)
        const idMatch = value.match(/\/files\/([a-f0-9]+)/);
        if (idMatch && idMatch[1] && fileUsageMap.has(idMatch[1])) {
          fileUsageMap.set(idMatch[1], true);
          continue;
        }
      }

      // Recursively check nested objects and arrays
      checkFieldsForFileIds(value, fileUsageMap);
    }
  }
}

/**
 * Checks for file IDs in a stringified content source
 * @param {Object} source - Content source to check for file references
 * @param {Map} fileUsageMap - Map tracking file usage status
 */
function checkStringContentForFileIds(source, fileUsageMap) {
  if (!source) return;

  // Convert to string to search, but handle JSON.stringify circular references
  let contentString;
  try {
    contentString = JSON.stringify(source);
  } catch (error) {
    console.error("Error stringifying content:", error);
    return;
  }

  // Check each file ID against the content string
  for (const [fileId, used] of fileUsageMap.entries()) {
    // Skip if already marked as used
    if (used) continue;

    // Use regex pattern to find exact file ID matches
    const pattern = new RegExp(`["']${fileId}["']|${fileId}`, 'g');
    if (pattern.test(contentString)) {
      fileUsageMap.set(fileId, true);
    }
  }
}

/**
 * Formats file data for response
 * @param {Object} file - File document
 * @param {boolean} [isUsed] - Whether the file is used (optional)
 * @returns {Object} Formatted file data
 */
function formatFileResponse(file, isUsed = undefined) {
  const response = {
    _id: file._id,
    filename: file.filename,
    originalName: file.originalName,
    contentType: file.contentType,
    section: file.section,
    createdAt: file.createdAt
  };

  if (isUsed !== undefined) {
    response.isUsed = isUsed;
  }

  return response;
}

/**
 * GET handler to retrieve unused files
 */
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const specificFileId = searchParams.get('fileId');

    // Get files data
    let fileQuery = {};
    if (specificFileId && mongoose.Types.ObjectId.isValid(specificFileId)) {
      fileQuery = { _id: specificFileId };
    }

    const allFiles = await FileUpload.find(fileQuery, { data: 0 }).lean();

    if (specificFileId && allFiles.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'File not found'
      }, { status: 404 });
    }

    // Create a map to track file usage
    const fileUsageMap = new Map();
    allFiles.forEach(file => {
      fileUsageMap.set(file._id.toString(), false);
    });

    // Get content data where files might be referenced
    const [siteContent, techelonsData, techelonsRegistrations, workshopRegistrations] = await Promise.all([
      SiteContent.findOne().lean(),
      TechelonsData.findOne().lean(),
      TechelonsRegistration.find().lean(),
      WorkshopRegistration.find().lean()
    ]);

    // Check models for file references
    checkFieldsForFileIds(siteContent, fileUsageMap);
    checkFieldsForFileIds(techelonsData, fileUsageMap);

    // Check registrations
    techelonsRegistrations.forEach(registration => {
      checkFieldsForFileIds(registration, fileUsageMap);
    });

    workshopRegistrations.forEach(registration => {
      checkFieldsForFileIds(registration, fileUsageMap);
    });

    // Fallback string search for missed references
    const contentSources = [
      siteContent,
      techelonsData,
      ...techelonsRegistrations,
      ...workshopRegistrations
    ];

    for (const source of contentSources) {
      checkStringContentForFileIds(source, fileUsageMap);
    }

    // If looking for a specific file, provide detailed usage info
    if (specificFileId) {
      const fileInfo = allFiles[0];
      const isUsed = fileUsageMap.get(specificFileId);

      return NextResponse.json({
        success: true,
        file: formatFileResponse(fileInfo, isUsed)
      });
    }

    // Filter out unused files
    const unusedFiles = allFiles.filter(file =>
      !fileUsageMap.get(file._id.toString())
    );

    return NextResponse.json({
      success: true,
      files: unusedFiles.map(file => formatFileResponse(file))
    });
  } catch (error) {
    console.error('Error getting unused files:', error);
    return NextResponse.json(
      { error: 'Failed to get unused files' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler to remove unused files
 */
export async function DELETE(request) {
  try {
    const { fileIds } = await request.json();

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty file IDs array' },
        { status: 400 }
      );
    }

    // Validate IDs
    const validFileIds = fileIds.filter(id => mongoose.Types.ObjectId.isValid(id));

    if (validFileIds.length === 0) {
      return NextResponse.json(
        { error: 'No valid file IDs provided' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Delete files
    const result = await FileUpload.deleteMany({
      _id: { $in: validFileIds.map(id => new mongoose.Types.ObjectId(id)) }
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting unused files:', error);
    return NextResponse.json(
      { error: 'Failed to delete unused files' },
      { status: 500 }
    );
  }
}