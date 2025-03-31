import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import WorkshopRegistration from '@/models/WorkshopRegistration';
import { sendWorkshopConfirmation } from '@/app/email/emailServiceWorkshop';
import { fetchSiteContent } from '@/lib/utils';
import { defaultWorkshopData } from '../setup/route';

// Error types
const ERROR_TYPES = {
  MISSING_FIELDS: 'MISSING_FIELDS',
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  DUPLICATE_PHONE: 'DUPLICATE_PHONE',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EMAIL_FAILED: 'EMAIL_FAILED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  INVALID_JSON: 'INVALID_JSON',
  REGISTRATION_CLOSED: 'REGISTRATION_CLOSED'
};

// Validate request data
const validateRequestData = (data) => {
  const requiredFields = ['email', 'name', 'rollNo', 'course', 'year', 'phone'];
  const missingFields = requiredFields.filter(field => !data[field]);

  if (missingFields.length > 0) {
    return {
      error: `Missing required fields: ${missingFields.join(', ')}`,
      type: ERROR_TYPES.MISSING_FIELDS,
      fields: missingFields
    };
  }

  return null;
};

// Create email template
const createEmailTemplate = (name, workshopData) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h1 style="color: #4a5568; text-align: center;">Workshop Registration Confirmation</h1>
      <p style="font-size: 16px; line-height: 1.5; color: #4a5568;">Dear ${name},</p>
      <p style="font-size: 16px; line-height: 1.5; color: #4a5568;">Thank you for registering for the ${workshopData.title} workshop. Your registration has been confirmed.</p>
      
      <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h2 style="color: #4a5568; font-size: 18px;">Workshop Details:</h2>
        ${workshopData.details.map(detail => `
          <p style="margin: 10px 0; color: #4a5568;">
            <strong>${detail.label}:</strong> ${detail.value}
          </p>
        `).join('')}
      </div>
      
      <p style="font-size: 16px; line-height: 1.5; color: #4a5568;">Please join our WhatsApp group for further updates:</p>
      <p style="text-align: center;">
        <a href="${workshopData.whatsappGroupLink}" style="display: inline-block; background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Join WhatsApp Group</a>
      </p>
      
      <p style="font-size: 16px; line-height: 1.5; color: #4a5568;">If you have any questions, feel free to contact us.</p>
      <p style="font-size: 16px; line-height: 1.5; color: #4a5568;">Best regards,<br>Websters - Shivaji College</p>
      
      <div style="margin-top: 30px; text-align: center; color: #718096; font-size: 14px;">
        <p>Follow us on social media:</p>
        <p>
          ${workshopData.socialMedia?.instagram ? `<a href="${workshopData.socialMedia.instagram}" style="color: #E1306C; margin: 0 10px; text-decoration: none;">Instagram</a>` : ''}
          ${workshopData.socialMedia?.linkedin ? `<a href="${workshopData.socialMedia.linkedin}" style="color: #0077B5; margin: 0 10px; text-decoration: none;">LinkedIn</a>` : ''}
        </p>
      </div>
    </div>
  `;
};

// Send confirmation email
const sendConfirmationEmail = async (data, workshopData) => {
  try {
    const { email, name } = data;
    const template = createEmailTemplate(name, workshopData);

    console.log(`Sending workshop confirmation email to ${email}`);

    const emailResult = await sendWorkshopConfirmation({
      email,
      name,
      subject: workshopData.emailNotification?.subject || 'Workshop Registration Confirmation',
      template
    });

    if (emailResult.success) {
      console.log(`Workshop confirmation email sent successfully to ${email} with messageId: ${emailResult.messageId}`);
    } else {
      console.error(`Failed to send workshop confirmation email to ${email}:`, emailResult.error);
    }

    return emailResult;
  } catch (error) {
    console.error('Email sending error:', error.message);
    // Don't fail the registration if email fails
    return {
      success: false,
      error: error.message
    };
  }
};

export async function POST(req) {
  // Track request timing for performance monitoring
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(2, 15);

  try {
    console.log(`[${requestId}] Workshop registration API called`);

    // Parse request body
    let data;
    try {
      data = await req.json();
    } catch (error) {
      console.error(`[${requestId}] Invalid request body:`, error.message);
      return NextResponse.json(
        { error: 'Invalid request body', type: ERROR_TYPES.INVALID_JSON },
        { status: 400 }
      );
    }

    // Validate required fields
    const validationError = validateRequestData(data);
    if (validationError) {
      return NextResponse.json(validationError, { status: 400 });
    }

    // Connect to database
    await connectToDatabase();

    // Fetch site content for workshop data
    const siteContent = await fetchSiteContent();
    let workshopData = siteContent?.workshop;

    // If workshop data is not found, try to set it up
    if (!workshopData) {
      try {
        const setupResponse = await fetch(new URL('/api/workshop/setup', req.url));
        if (setupResponse.ok) {
          const setupResult = await setupResponse.json();
          workshopData = setupResult.data || defaultWorkshopData;
        } else {
          workshopData = defaultWorkshopData;
        }
      } catch (setupError) {
        console.error(`[${requestId}] Error setting up workshop data:`, setupError);
        workshopData = defaultWorkshopData;
      }
    }

    // Check if registration is open
    if (!workshopData.isRegistrationOpen) {
      return NextResponse.json(
        { error: 'Workshop registration is closed', type: ERROR_TYPES.REGISTRATION_CLOSED },
        { status: 403 }
      );
    }

    // Check for existing registration by email or phone
    const existingRegistration = await WorkshopRegistration.findOne({
      $or: [
        { email: data.email.toLowerCase() },
        { phone: data.phone }
      ]
    });

    if (existingRegistration) {
      // Create a registration token for the existing user
      const registrationToken = Buffer.from(data.email).toString('base64');

      console.log(`[${requestId}] User already registered: ${data.email}`);

      return NextResponse.json(
        {
          success: true,
          message: "You are already registered",
          alreadyRegistered: true,
          registrationToken,
          whatsappLink: workshopData.whatsappGroupLink
        },
        { status: 200 }
      );
    }

    // Prepare registration data
    const registrationData = {
      email: data.email.toLowerCase().trim(),
      name: data.name.trim(),
      rollNo: data.rollNo.trim(),
      course: data.course.trim(),
      college: data.college || "Shivaji College",
      year: data.year,
      phone: data.phone.trim(),
      query: data.query?.trim() || "",
      registrationType: "Workshop",
      registrationDate: new Date()
    };

    // Save to database
    const registration = new WorkshopRegistration(registrationData);
    await registration.save();

    // Send confirmation email
    console.log(`[${requestId}] Registration successful, sending confirmation email`);
    const emailResult = await sendConfirmationEmail(data, workshopData);

    // Return success response
    const response = {
      success: true,
      message: "Registration successful",
      timestamp: new Date().toISOString(),
      whatsappLink: workshopData.whatsappGroupLink,
      registrationToken: Buffer.from(data.email).toString('base64'),
      emailSent: emailResult.success
    };

    // Log performance metrics
    const endTime = Date.now();
    console.log(`[${requestId}] Request completed in ${endTime - startTime}ms`);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const endTime = Date.now();
    console.error(`[${requestId}] Registration error (${endTime - startTime}ms):`, {
      message: error.message,
      type: error.type || ERROR_TYPES.UNKNOWN_ERROR,
    });

    // Check for duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const errorType = field === 'email' ? ERROR_TYPES.DUPLICATE_EMAIL : ERROR_TYPES.DUPLICATE_PHONE;
      const errorMessage = field === 'email'
        ? 'You have already registered with this email address'
        : 'This phone number is already registered';

      return NextResponse.json(
        { error: errorMessage, type: errorType },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: error.message || 'Registration failed',
        type: error.type || ERROR_TYPES.UNKNOWN_ERROR
      },
      { status: 500 }
    );
  }
}