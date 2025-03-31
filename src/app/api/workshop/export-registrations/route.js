import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import WorkshopRegistration from '@/models/WorkshopRegistration';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Authenticate user
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

    // Define CSV headers
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Roll No',
      'Course',
      'College',
      'Year',
      'Query',
      'Registration Date'
    ];

    // Fetch all workshop registrations
    const registrations = await WorkshopRegistration.find({})
      .sort({ registrationDate: -1 })
      .lean();

    // Create CSV content
    const csvRows = [headers.join(',')];

    // Add data rows
    for (const registration of registrations) {
      const row = headers.map(header => {
        let value = '';

        switch (header) {
          case 'Name':
            value = registration.name || '';
            break;
          case 'Email':
            value = registration.email || '';
            break;
          case 'Phone':
            value = registration.phone || '';
            break;
          case 'Roll No':
            value = registration.rollNo || '';
            break;
          case 'Course':
            value = registration.course || '';
            break;
          case 'College':
            value = registration.college || '';
            break;
          case 'Year':
            value = registration.year || '';
            break;
          case 'Query':
            value = registration.query || '';
            break;
          case 'Registration Date':
            value = registration.registrationDate ? new Date(registration.registrationDate).toLocaleString() : '';
            break;
        }

        // Escape CSV values properly
        return `"${value.toString().replace(/"/g, '""')}"`;
      });

      csvRows.push(row.join(','));
    }

    // Generate filename with current date
    const filename = `workshop-registrations-${new Date().toISOString().split('T')[0]}.csv`;

    // Create response with appropriate headers
    return new NextResponse(csvRows.join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error exporting workshop registration data:', error);

    return NextResponse.json({
      error: 'Failed to export workshop registration data',
      message: error.message
    }, { status: 500 });
  }
}