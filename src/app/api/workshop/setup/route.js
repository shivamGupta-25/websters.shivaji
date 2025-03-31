import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import SiteContent from '@/models/SiteContent';

// Default workshop data
export const defaultWorkshopData = {
  title: "Web Development Workshop",
  shortDescription: "Learn the fundamentals of web development",
  isRegistrationOpen: true,
  formSubmittedLink: "/formsubmitted/workshop",
  details: [
    {
      label: "Date",
      value: "March 25, 2023",
      id: "date"
    },
    {
      label: "Time",
      value: "10:00 AM - 4:00 PM",
      id: "time"
    },
    {
      label: "Venue",
      value: "Computer Lab, Shivaji College",
      id: "venue"
    },
    {
      label: "Registration Fee",
      value: "Free",
      id: "fee"
    }
  ],
  bannerImage: "/images/workshop-banner.jpg",
  whatsappGroupLink: "https://chat.whatsapp.com/example",
  socialMedia: {
    instagram: "https://instagram.com/websters",
    linkedin: "https://linkedin.com/company/websters"
  },
  emailNotification: {
    subject: "Workshop Registration Confirmation"
  }
};

// Helper function to get or create workshop data
async function getOrCreateWorkshopData(customData = null) {
  await connectToDatabase();

  const content = await SiteContent.findOne({}) || new SiteContent({});

  if (customData) {
    content.workshop = customData;
  } else if (!content.workshop) {
    content.workshop = defaultWorkshopData;
  }

  await content.save();
  return content.workshop;
}

export async function GET() {
  try {
    const workshopData = await getOrCreateWorkshopData();
    return NextResponse.json({
      success: true,
      data: workshopData
    });
  } catch (error) {
    console.error('Error fetching workshop data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch workshop data'
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { workshop } = await request.json();

    if (!workshop) {
      return NextResponse.json({
        success: false,
        error: 'Workshop data is required'
      }, { status: 400 });
    }

    const updatedWorkshopData = await getOrCreateWorkshopData(workshop);

    return NextResponse.json({
      success: true,
      data: updatedWorkshopData
    });
  } catch (error) {
    console.error('Error updating workshop data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update workshop data'
    }, { status: 500 });
  }
}