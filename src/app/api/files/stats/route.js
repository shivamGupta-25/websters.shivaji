import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import FileUpload from '@/models/FileUpload';

export async function GET() {
  try {
    await connectToDatabase();

    // Execute all queries in parallel for better performance
    const [totalCount, sectionCounts, typeCounts, uploadStats] = await Promise.all([
      // Get total count of files
      FileUpload.countDocuments(),

      // Get count by section
      FileUpload.aggregate([
        {
          $group: {
            _id: { $ifNull: ["$section", "misc"] },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]),

      // Get file types distribution (simplified)
      FileUpload.aggregate([
        {
          $project: {
            fileExtension: {
              $cond: {
                if: { $ne: [{ $indexOfCP: ["$contentType", "/"] }, -1] },
                then: { $arrayElemAt: [{ $split: ["$contentType", "/"] }, 1] },
                else: "$contentType"
              }
            }
          }
        },
        { $group: { _id: "$fileExtension", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      // Get upload statistics by month (last 12 months)
      FileUpload.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            count: { $sum: 1 },
            totalSize: { $sum: "$size" }  // Added total size for additional insights
          }
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 12 },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            count: 1,
            totalSize: 1,
            averageSize: { $divide: ["$totalSize", "$count"] }
          }
        }
      ])
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalCount,
        sections: sectionCounts,
        fileTypes: typeCounts,
        monthlyUploads: uploadStats
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error getting file stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get file statistics' },
      { status: 500 }
    );
  }
}