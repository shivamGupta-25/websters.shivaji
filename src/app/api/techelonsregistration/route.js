import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import TechelonsRegistration from '@/models/TechelonsRegistration';
import TechelonsData from '@/models/TechelonsData';
import { z } from 'zod';
import { sendTechelonsRegistrationEmail } from '@/app/email/emailServiceTechelons';

// Email validation schema
const emailSchema = z.string()
  .min(1, "Email is required")
  .email("Invalid email address")
  .regex(
    /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|du\.ac\.in|ipu\.ac\.in|ignou\.ac\.in|jnu\.ac\.in|iitd\.ac\.in|nsut\.ac\.in|dtu\.ac\.in|igdtuw\.ac\.in|aud\.ac\.in|jamiahamdard\.edu|bhu\.ac\.in|bvpindia\.com|mait\.ac\.in|ip\.edu|msit\.in|gbpuat\.ac\.in)$/,
    "Please use valid Email ID"
  );

// Phone validation schema
const phoneSchema = z.string()
  .min(1, "Phone number is required")
  .length(10, "Phone number must be exactly 10 digits")
  .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number");

// Team member validation schema
const teamMemberSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: emailSchema,
  phone: phoneSchema,
  rollNo: z.string().min(2, "Roll No. is required"),
  course: z.string().min(2, "Course is required"),
  year: z.enum(["1st Year", "2nd Year", "3rd Year"], {
    required_error: "Please select your year",
  }),
  college: z.string().min(2, "College is required"),
  otherCollege: z.string().optional(),
});

// Registration validation schema
const registrationSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  eventName: z.string().min(1, "Event name is required"),
  isTeamEvent: z.boolean().default(false),
  teamName: z.string().optional(),
  mainParticipant: teamMemberSchema,
  teamMembers: z.array(teamMemberSchema).optional(),
  collegeIdUrl: z.string().optional(),
  query: z.string().optional(),
});

// Generate registration token for the user
function generateRegistrationToken(registration) {
  return Buffer.from(registration.mainParticipant.email).toString('base64');
}

// Check for duplicates within the same team
function checkInternalDuplicates(registrationData) {
  try {
    const emails = new Set();
    const phones = new Set();

    // Add main participant
    if (registrationData.mainParticipant?.email) {
      emails.add(registrationData.mainParticipant.email.toLowerCase());
    }

    if (registrationData.mainParticipant?.phone) {
      phones.add(registrationData.mainParticipant.phone);
    }

    // Check team members
    for (const member of registrationData.teamMembers || []) {
      if (!member || !member.email || !member.phone) continue;

      const email = member.email.toLowerCase();
      const phone = member.phone;

      if (emails.has(email)) {
        return {
          error: true,
          message: `You cannot use the same email address (${email}) for multiple team members. Each team member must have a unique email address.`
        };
      }

      if (phones.has(phone)) {
        return {
          error: true,
          message: `You cannot use the same phone number (${phone}) for multiple team members. Each team member must have a unique phone number.`
        };
      }

      emails.add(email);
      phones.add(phone);
    }

    return { error: false };
  } catch (error) {
    console.error('Error in checkInternalDuplicates:', error);
    return { error: false }; // Continue with registration even if check fails
  }
}

// Generate a detailed error message for existing registrations
async function getExistingRegistrationMessage(event, existingRegistration, contactInfo, isEmail = true) {
  const fieldType = isEmail ? 'email address' : 'phone number';
  const fieldValue = isEmail ? existingRegistration.mainParticipant.email : existingRegistration.mainParticipant.phone;

  try {
    return `The ${fieldType} ${contactInfo} is already registered for "${event.name}" ${existingRegistration.isTeamEvent
        ? `as ${fieldValue === contactInfo
          ? `the team leader of "${existingRegistration.teamName || 'Unnamed Team'}"`
          : `a team member in "${existingRegistration.teamName || 'Unnamed Team'}"`}`
        : `as an individual participant`
      } under the name "${existingRegistration.mainParticipant.name}".`;
  } catch (error) {
    console.error(`Error creating detailed message for ${fieldType}:`, error);
    return `You are already registered for this event with this ${fieldType}.`;
  }
}

// Check for registration conflicts in database
async function checkExistingRegistrations(eventId, teamMembers) {
  try {
    if (!teamMembers || teamMembers.length === 0) return null;

    // Extract emails and phones to check
    const teamMemberEmails = teamMembers
      .map(member => member.email?.toLowerCase())
      .filter(Boolean);

    const teamMemberPhones = teamMembers
      .map(member => member.phone)
      .filter(Boolean);

    // Check for existing registrations with team member emails
    if (teamMemberEmails.length > 0) {
      const existingEmailRegistrations = await TechelonsRegistration.findOne({
        eventId,
        $or: [
          { 'mainParticipant.email': { $in: teamMemberEmails } },
          { 'teamMembers.email': { $in: teamMemberEmails } }
        ]
      });

      if (existingEmailRegistrations) {
        // Find the conflicting email
        let conflictEmail = '';
        const mainEmail = existingEmailRegistrations.mainParticipant?.email?.toLowerCase();

        if (mainEmail && teamMemberEmails.includes(mainEmail)) {
          conflictEmail = mainEmail;
        } else {
          for (const member of existingEmailRegistrations.teamMembers || []) {
            const memberEmail = member.email?.toLowerCase();
            if (memberEmail && teamMemberEmails.includes(memberEmail)) {
              conflictEmail = memberEmail;
              break;
            }
          }
        }

        return {
          error: true,
          message: `The email address ${conflictEmail || 'provided'} is already registered for this event.`
        };
      }
    }

    // Check for existing registrations with team member phones
    if (teamMemberPhones.length > 0) {
      const existingPhoneRegistrations = await TechelonsRegistration.findOne({
        eventId,
        $or: [
          { 'mainParticipant.phone': { $in: teamMemberPhones } },
          { 'teamMembers.phone': { $in: teamMemberPhones } }
        ]
      });

      if (existingPhoneRegistrations) {
        // Find the conflicting phone
        let conflictPhone = '';
        const mainPhone = existingPhoneRegistrations.mainParticipant?.phone;

        if (mainPhone && teamMemberPhones.includes(mainPhone)) {
          conflictPhone = mainPhone;
        } else {
          for (const member of existingPhoneRegistrations.teamMembers || []) {
            if (member.phone && teamMemberPhones.includes(member.phone)) {
              conflictPhone = member.phone;
              break;
            }
          }
        }

        return {
          error: true,
          message: `The phone number ${conflictPhone || 'provided'} is already registered for this event.`
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error checking for team member duplicates:', error);
    return null; // Continue with registration even if check fails
  }
}

// Send confirmation emails to participants
async function sendConfirmationEmails(registration, event) {
  try {
    // Send to main participant
    await sendTechelonsRegistrationEmail(registration, event);

    // Send to team members if applicable
    if (registration.isTeamEvent && registration.teamMembers?.length > 0) {
      for (const member of registration.teamMembers) {
        const teamMemberRegistration = {
          ...registration.toObject(),
          mainParticipant: member // Set the team member as mainParticipant for the email
        };
        await sendTechelonsRegistrationEmail(
          teamMemberRegistration,
          event,
          true // isTeamMember flag
        );
      }
    }
    return true;
  } catch (error) {
    console.error('Error sending confirmation emails:', error);
    return false; // Continue with registration even if email fails
  }
}

// POST handler for registration
export async function POST(request) {
  try {
    // Parse and validate request body
    const body = await request.json().catch(error => {
      console.error('Error parsing request body:', error);
      return null;
    });

    if (!body) {
      return NextResponse.json({
        error: 'Invalid request body'
      }, { status: 400 });
    }

    const validationResult = registrationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Validation error',
        details: validationResult.error.errors
      }, { status: 400 });
    }

    const registrationData = validationResult.data;

    // Connect to database
    try {
      await connectToDatabase();
    } catch (dbError) {
      return NextResponse.json({
        error: 'Failed to connect to database. Please try again later.'
      }, { status: 500 });
    }

    // Check if event exists and is open for registration
    const techelonsData = await TechelonsData.findOne({});
    if (!techelonsData) {
      return NextResponse.json({ error: 'Techelons data not found' }, { status: 404 });
    }

    const event = techelonsData.events.find(e => e.id === registrationData.eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.registrationStatus !== 'open') {
      return NextResponse.json({
        error: `Registration is closed for this event. Current status: ${event.registrationStatus}`
      }, { status: 403 });
    }

    // For team events, validate team size and check for duplicates
    if (registrationData.isTeamEvent) {
      const teamSize = (registrationData.teamMembers?.length || 0) + 1; // +1 for main participant

      if (teamSize < event.teamSize.min) {
        return NextResponse.json({
          error: `Team must have at least ${event.teamSize.min} members`
        }, { status: 400 });
      }

      if (teamSize > event.teamSize.max) {
        return NextResponse.json({
          error: `Team cannot have more than ${event.teamSize.max} members`
        }, { status: 400 });
      }

      // Check for internal duplicates
      const internalDuplicateCheck = checkInternalDuplicates(registrationData);
      if (internalDuplicateCheck.error) {
        return NextResponse.json({
          error: internalDuplicateCheck.message
        }, { status: 400 });
      }

      // Check if any team members are already registered for this event
      const existingMemberCheck = await checkExistingRegistrations(
        registrationData.eventId,
        registrationData.teamMembers
      );

      if (existingMemberCheck?.error) {
        return NextResponse.json({
          error: existingMemberCheck.message
        }, { status: 400 });
      }
    }

    // Check if main participant is already registered for this event
    const existingRegistrationByEmail = await TechelonsRegistration.findOne({
      eventId: registrationData.eventId,
      'mainParticipant.email': registrationData.mainParticipant.email.toLowerCase()
    });

    if (existingRegistrationByEmail) {
      const registrationToken = generateRegistrationToken(existingRegistrationByEmail);
      const message = await getExistingRegistrationMessage(
        event,
        existingRegistrationByEmail,
        registrationData.mainParticipant.email,
        true
      );

      return NextResponse.json({
        alreadyRegistered: true,
        registrationToken,
        message
      });
    }

    const existingRegistrationByPhone = await TechelonsRegistration.findOne({
      eventId: registrationData.eventId,
      'mainParticipant.phone': registrationData.mainParticipant.phone
    });

    if (existingRegistrationByPhone) {
      const registrationToken = generateRegistrationToken(existingRegistrationByPhone);
      const message = await getExistingRegistrationMessage(
        event,
        existingRegistrationByPhone,
        registrationData.mainParticipant.phone,
        false
      );

      return NextResponse.json({
        alreadyRegistered: true,
        registrationToken,
        message
      });
    }

    // Create new registration
    const registration = await TechelonsRegistration.create(registrationData);
    const registrationToken = generateRegistrationToken(registration);

    // Send confirmation emails (non-blocking)
    sendConfirmationEmails(registration, event);

    return NextResponse.json({
      success: true,
      registrationToken,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Error processing registration:', error);

    // Handle duplicate key error (MongoDB error code 11000)
    if (error.code === 11000) {
      return NextResponse.json({
        error: 'You are already registered for this event'
      }, { status: 409 });
    }

    return NextResponse.json({
      error: 'Failed to process registration',
      message: error.message || 'Unknown error occurred'
    }, { status: 500 });
  }
}

// GET handler to check registration status
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Decode the base64 token to get the email
    const email = Buffer.from(token, 'base64').toString();

    // Connect to database
    await connectToDatabase();

    // Find registration by email
    const registration = await TechelonsRegistration.findOne({
      'mainParticipant.email': email
    });

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // Find event details
    const techelonsData = await TechelonsData.findOne({});
    const event = techelonsData?.events.find(e => e.id === registration.eventId);

    return NextResponse.json({
      registration,
      event
    });
  } catch (error) {
    console.error('Error checking registration:', error);
    return NextResponse.json({ error: 'Failed to check registration' }, { status: 500 });
  }
}