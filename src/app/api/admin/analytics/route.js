import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import TechelonsRegistration from '@/models/TechelonsRegistration';
import WorkshopRegistration from '@/models/WorkshopRegistration';
import TechelonsData from '@/models/TechelonsData';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get('admin_session');

    if (!adminCookie?.value) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Get event data
    const eventData = await TechelonsData.findOne({}).lean();
    const events = eventData?.events || [];

    // Get Techelons registrations
    const techelonsRegistrations = await TechelonsRegistration.find().lean();

    // Get Workshop registrations
    const workshopRegistrations = await WorkshopRegistration.find().lean();

    // Prepare analytics data
    const analytics = {
      events: {
        totalEvents: events.length,
        featuredEvents: events.filter(event => event.featured).length,
        eventsByCategory: {},
        registrationsByEvent: {}
      },
      workshops: {
        totalRegistrations: workshopRegistrations.length,
        registrationsByDay: {},
        registrationsByYear: {},
        registrationsByCourse: {},
        registrationsByCollege: {}
      },
      registrations: {
        techelons: {
          totalRegistrations: techelonsRegistrations.length,
          registrationsByDay: {},
          registrationsByYear: {},
          registrationsByCourse: {},
          registrationsByCollege: {},
          teamSizeDistribution: {}
        }
      }
    };

    // Process events by category
    events.forEach(event => {
      const category = event.category || 'Uncategorized';
      analytics.events.eventsByCategory[category] = (analytics.events.eventsByCategory[category] || 0) + 1;
    });

    // Process Techelons registrations
    techelonsRegistrations.forEach(registration => {
      // Count registrations by event
      const eventName = registration.eventName || 'Unknown';
      analytics.events.registrationsByEvent[eventName] = (analytics.events.registrationsByEvent[eventName] || 0) + 1;

      // Process registration date
      const registrationDate = registration.registrationDate ? 
        new Date(registration.registrationDate).toISOString().split('T')[0] : 
        'Unknown';
      analytics.registrations.techelons.registrationsByDay[registrationDate] = 
        (analytics.registrations.techelons.registrationsByDay[registrationDate] || 0) + 1;

      // Process main participant year - always use only main participant data regardless of team/solo event
      const year = registration.mainParticipant?.year || 'Unknown';
      analytics.registrations.techelons.registrationsByYear[year] = 
        (analytics.registrations.techelons.registrationsByYear[year] || 0) + 1;

      // Process main participant course - always use only main participant data regardless of team/solo event
      const course = registration.mainParticipant?.course || 'Unknown';
      analytics.registrations.techelons.registrationsByCourse[course] = 
        (analytics.registrations.techelons.registrationsByCourse[course] || 0) + 1;

      // Process main participant college - always use only main participant data regardless of team/solo event
      const college = registration.mainParticipant?.college || 'Unknown';
      analytics.registrations.techelons.registrationsByCollege[college] = 
        (analytics.registrations.techelons.registrationsByCollege[college] || 0) + 1;

      // Process team size - consider both team and solo events
      const teamSize = registration.isTeamEvent 
        ? (registration.teamMembers?.length || 0) + 1 // Including main participant for team events
        : 1; // Solo participant for non-team events
      analytics.registrations.techelons.teamSizeDistribution[teamSize] = 
        (analytics.registrations.techelons.teamSizeDistribution[teamSize] || 0) + 1;
    });

    // Process Workshop registrations
    workshopRegistrations.forEach(registration => {
      // Process registration date
      const registrationDate = registration.registrationDate ? 
        new Date(registration.registrationDate).toISOString().split('T')[0] : 
        'Unknown';
      analytics.workshops.registrationsByDay[registrationDate] = 
        (analytics.workshops.registrationsByDay[registrationDate] || 0) + 1;

      // Process year
      const year = registration.year || 'Unknown';
      analytics.workshops.registrationsByYear[year] = 
        (analytics.workshops.registrationsByYear[year] || 0) + 1;

      // Process course
      const course = registration.course || 'Unknown';
      analytics.workshops.registrationsByCourse[course] = 
        (analytics.workshops.registrationsByCourse[course] || 0) + 1;

      // Process college
      const college = registration.college || 'Unknown';
      analytics.workshops.registrationsByCollege[college] = 
        (analytics.workshops.registrationsByCollege[college] || 0) + 1;
    });

    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    console.error('Error generating analytics data:', error);

    return NextResponse.json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
} 