import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import TechelonsRegistration from '@/models/TechelonsRegistration';

/**
 * Formats a value for CSV, escaping special characters as needed
 * @param {any} value - The value to format
 * @returns {string} - CSV-formatted string
 */
function formatCSVValue(value) {
  if (value === null || value === undefined) return 'N/A';

  const stringValue = String(value);
  // Escape quotes and wrap fields with commas or quotes in double quotes
  return (stringValue.includes(',') || stringValue.includes('"'))
    ? `"${stringValue.replace(/"/g, '""')}"`
    : stringValue;
}

/**
 * Formats a team member into a readable string
 * @param {Object} member - Team member object
 * @returns {string} - Formatted member string
 */
function formatTeamMember(member) {
  return `${member.name} (${member.email}, ${member.phone}, ${member.rollNo}, ${member.course}, ${member.year}, ${member.college})`;
}

/**
 * Converts registrations data to CSV format
 * @param {Array} registrations - Array of registration objects
 * @returns {string} - CSV formatted string
 */
function convertToCSV(registrations) {
  const headers = [
    'Event ID',
    'Event Name',
    'Team Name',
    'Registration Date',
    'Main Participant Name',
    'Main Participant Email',
    'Main Participant Phone',
    'Main Participant Roll No',
    'Main Participant Course',
    'Main Participant Year',
    'Main Participant College',
    'College ID URL',
    'Team Members',
    'Query'
  ];

  const rows = registrations.map(reg => {
    // Format team members
    const teamMembers = reg.teamMembers?.length
      ? reg.teamMembers.map(formatTeamMember).join(' | ')
      : '';

    // Get full URL for college ID
    const collegeIdUrl = reg.collegeIdUrl
      ? (reg.collegeIdUrl.startsWith('/api/files')
        ? `http://websters-shivaji.vercel.app${reg.collegeIdUrl}`
        : reg.collegeIdUrl)
      : 'N/A';

    return [
      reg.eventId,
      reg.eventName,
      reg.teamName || 'N/A',
      new Date(reg.registrationDate).toLocaleString(),
      reg.mainParticipant.name,
      reg.mainParticipant.email,
      reg.mainParticipant.phone,
      reg.mainParticipant.rollNo,
      reg.mainParticipant.course,
      reg.mainParticipant.year,
      reg.mainParticipant.college,
      collegeIdUrl,
      teamMembers,
      reg.query || 'N/A'
    ].map(formatCSVValue).join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * API route handler for exporting Techelons registrations as CSV
 */
export async function GET() {
  try {
    await connectToDatabase();

    const registrations = await TechelonsRegistration.find()
      .sort({ registrationDate: -1 })
      .lean(); // Use lean() for better performance with large datasets

    const csv = convertToCSV(registrations);

    // Set appropriate headers for CSV download
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="techelons-registrations.csv"'
      }
    });
  } catch (error) {
    console.error('Error exporting registrations:', error);
    return NextResponse.json(
      { error: 'Failed to export registrations', message: error.message },
      { status: 500 }
    );
  }
}