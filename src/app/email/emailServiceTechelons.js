import nodemailer from 'nodemailer';
import TechelonsData from '@/models/TechelonsData';

/**
 * Create a reusable nodemailer transporter using Gmail
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Get default WhatsApp group link from TechelonsData
 * @returns {Promise<string>} - Default WhatsApp group link or empty string
 */
async function getDefaultWhatsAppGroup() {
  try {
    const techelonsData = await TechelonsData.findOne({});
    if (techelonsData && techelonsData.whatsappGroups) {
      // Check if it's a Map object
      if (techelonsData.whatsappGroups instanceof Map) {
        return techelonsData.whatsappGroups.get('default') || '';
      } 
      // Treat as a plain object
      return techelonsData.whatsappGroups.default || '';
    }
    return '';
  } catch (error) {
    console.error('Error fetching default WhatsApp group:', error);
    return '';
  }
}

/**
 * Send a confirmation email for Techelons registration
 * @param {Object} registration - The registration data containing participant information and team details
 * @param {Object} event - The event data including name, date, venue, etc.
 * @param {Boolean} isTeamMember - Whether the recipient is a team member (not the main participant)
 * @returns {Promise} - Resolves with info from sending the email
 */
export async function sendTechelonsRegistrationEmail(registration, event, isTeamMember = false) {
  if (!registration || !event) {
    throw new Error('Registration and event data are required');
  }

  const recipient = isTeamMember ? registration.mainParticipant : registration.mainParticipant;

  if (!recipient || !recipient.email) {
    throw new Error('Recipient email is required');
  }

  // Get default WhatsApp group link if event doesn't have one
  let whatsappGroupLink = event.whatsappGroup || '';
  if (!whatsappGroupLink) {
    whatsappGroupLink = await getDefaultWhatsAppGroup();
  }
  
  // Get festival dates for both day events
  let festDates = { day1: null, day2: null };
  if (event.bothDayEvent) {
    try {
      // Connect to database to get festival dates
      const { default: connectToDatabase } = await import('@/lib/mongodb');
      const { default: TechelonsData } = await import('@/models/TechelonsData');
      
      await connectToDatabase();
      const techelonsData = await TechelonsData.findOne({});
      
      if (techelonsData && techelonsData.festInfo && techelonsData.festInfo.dates) {
        festDates.day1 = techelonsData.festInfo.dates.day1 || 'TBA';
        festDates.day2 = techelonsData.festInfo.dates.day2 || 'TBA';
      }
    } catch (error) {
      console.error('Error fetching festival dates:', error);
    }
  }

  // Format event details with fallbacks
  const eventDetails = {
    name: event.name || 'Event',
    date: event.date || 'TBA',
    time: event.time || 'TBA',
    venue: event.venue || 'TBA',
    tagline: event.tagline || '',
    category: event.category || '',
    bothDayEvent: event.bothDayEvent || false,
    festDay: event.festDay || '',
    festDates,
    instructions: event.instructions || '',
    rules: Array.isArray(event.rules) ? event.rules : [],
    competitionStructure: Array.isArray(event.competitionStructure) ? event.competitionStructure : [],
    evaluationCriteria: Array.isArray(event.evaluationCriteria) ? event.evaluationCriteria : [],
    whatsappGroup: whatsappGroupLink,
    coordinators: Array.isArray(event.coordinators) ? event.coordinators : []
  };

  // Get day display for email
  const dayDisplay = eventDetails.bothDayEvent ? 'Day 1 & Day 2' : 
    (eventDetails.festDay === 'day1' || eventDetails.festDay === 'DAY_1') ? 'Day 1' : 'Day 2';

  // Create team-specific content based on event type and recipient
  const teamContent = generateTeamContent(registration, isTeamMember);

  // Generate HTML content sections
  const rulesSection = generateRulesSection(eventDetails);
  const structureSection = generateStructureSection(eventDetails);
  const criteriaSection = generateCriteriaSection(eventDetails);
  const whatsappSection = eventDetails.whatsappGroup ?
    `<p>Join our WhatsApp group for updates and communication:</p>
     <a href="${eventDetails.whatsappGroup}" class="button whatsapp" target="_blank">Join WhatsApp Group</a>` : '';
  const coordinatorsSection = generateCoordinatorsSection(eventDetails);
  
  // Generate date display based on whether it's a both day event
  const dateDisplay = eventDetails.bothDayEvent ? 
    `<li><strong>Dates:</strong>
      <ul style="margin-top: 5px;">
        <li><strong>Day 1:</strong> ${eventDetails.festDates.day1}</li>
        <li><strong>Day 2:</strong> ${eventDetails.festDates.day2}</li>
      </ul>
    </li>` : 
    `<li><strong>Date:</strong> ${eventDetails.date}</li>`;

  // Create email HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #4f46e5;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 5px 5px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .details {
          margin: 20px 0;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 5px;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #4f46e5;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 15px;
        }
        .whatsapp {
          background-color: #25D366;
          color: white !important;
        }
        h2 {
          color: #4f46e5;
        }
        ul {
          padding-left: 20px;
        }
        .team-info {
          margin-top: 15px;
          padding: 10px;
          background-color: #f0f0f0;
          border-radius: 5px;
        }
        .badge {
          display: inline-block;
          padding: 3px 8px;
          background-color: #8b5cf6;
          color: white;
          border-radius: 12px;
          font-size: 12px;
          margin-left: 8px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Registration Confirmation</h1>
      </div>
      <div class="content">
        <p>Dear ${recipient.name},</p>
        
        <p>Thank you for registering for <strong>${eventDetails.name}</strong> at Techelons!</p>
        
        ${teamContent}
        
        <div class="details">
          <h2>Event Details</h2>
          <ul>
            <li><strong>Event:</strong> ${eventDetails.name}</li>
            ${eventDetails.tagline ? `<li><strong>Tagline:</strong> <em>${eventDetails.tagline}</em></li>` : ''}
            <li><strong>Festival Day:</strong> ${dayDisplay} ${eventDetails.bothDayEvent ? '<span class="badge">Both Days</span>' : ''}</li>
            ${dateDisplay}
            <li><strong>Time:</strong> ${eventDetails.time}</li>
            <li><strong>Venue:</strong> ${eventDetails.venue}</li>
            ${eventDetails.category ? `<li><strong>Category:</strong> ${eventDetails.category}</li>` : ''}
          </ul>
          
          ${registration.isTeamEvent && !isTeamMember ? `
            <div class="team-info">
              <h3>Team Information</h3>
              <p><strong>Team Name:</strong> ${registration.teamName || 'N/A'}</p>
              <p><strong>Team Size:</strong> ${(registration.teamMembers?.length || 0) + 1}</p>
            </div>
          ` : ''}
        </div>
        
        ${eventDetails.instructions ? `
          <h2>Instructions</h2>
          <p>${eventDetails.instructions}</p>
        ` : ''}
        
        ${rulesSection}
        ${structureSection}
        ${criteriaSection}
        ${whatsappSection}
        ${coordinatorsSection}
        
        <p>We look forward to seeing you at the event!</p>
        
        <p>Best regards,<br>Techelons Team</p>
      </div>
      <div class="footer">
        <p>This is an automated email. Please do not reply to this message.</p>
        <p>&copy; ${new Date().getFullYear()} Techelons, Shivaji College. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  // Email options
  const mailOptions = {
    from: `"Techelons" <${process.env.EMAIL_USER}>`,
    to: recipient.email,
    subject: `Registration Confirmation: ${eventDetails.name} - Techelons`,
    html: htmlContent,
  };

  // Send email and return promise
  return transporter.sendMail(mailOptions);
}

/**
 * Generate team-specific content based on registration type
 * @param {Object} registration - Registration data
 * @param {Boolean} isTeamMember - Whether recipient is team member
 * @returns {String} - HTML content for team info
 */
function generateTeamContent(registration, isTeamMember) {
  if (isTeamMember) {
    return `<p>You have been registered as a team member for team <strong>${registration.teamName || 'N/A'}</strong>.</p>`;
  } else if (registration.isTeamEvent) {
    return `<p>You have successfully registered your team <strong>${registration.teamName || 'N/A'}</strong>.</p>`;
  } else {
    return '<p>Your registration has been confirmed.</p>';
  }
}

/**
 * Generate the rules section if rules exist
 * @param {Object} eventDetails - Event details
 * @returns {String} - HTML content for rules
 */
function generateRulesSection(eventDetails) {
  if (!eventDetails.rules.length) return '';

  return `
    <h2>Rules</h2>
    <ul>
      ${eventDetails.rules.map(rule => `<li>${rule}</li>`).join('')}
    </ul>
  `;
}

/**
 * Generate the competition structure section if data exists
 * @param {Object} eventDetails - Event details
 * @returns {String} - HTML content for competition structure
 */
function generateStructureSection(eventDetails) {
  if (!eventDetails.competitionStructure.length) return '';

  return `
    <h2>Competition Structure</h2>
    <ol>
      ${eventDetails.competitionStructure.map(item => {
        if (typeof item === 'object') {
          return `
            <li>
              <strong>${item.title}</strong>
              ${item.description ? `<p>${item.description}</p>` : ''}
              ${item.tasks && item.tasks.length > 0 ? `
                <ul>
                  ${item.tasks.map(task => `<li>${task}</li>`).join('')}
                </ul>
              ` : ''}
            </li>
          `;
        } else {
          return `<li>${item}</li>`;
        }
      }).join('')}
    </ol>
  `;
}

/**
 * Generate the evaluation criteria section if data exists
 * @param {Object} eventDetails - Event details
 * @returns {String} - HTML content for evaluation criteria
 */
function generateCriteriaSection(eventDetails) {
  if (!eventDetails.evaluationCriteria.length) return '';

  return `
    <h2>Evaluation Criteria</h2>
    <ul>
      ${eventDetails.evaluationCriteria.map(criterion => `<li>${criterion}</li>`).join('')}
    </ul>
  `;
}

/**
 * Generate the coordinators section if data exists
 * @param {Object} eventDetails - Event details
 * @returns {String} - HTML content for coordinators
 */
function generateCoordinatorsSection(eventDetails) {
  if (!eventDetails.coordinators.length) return '';

  return `
    <p>If you have any questions, please feel free to contact the event coordinators:</p>
    <ul>
      ${eventDetails.coordinators.map(coordinator => `
        <li><strong>${coordinator.name}</strong> - ${coordinator.phone} (${coordinator.email})</li>
      `).join('')}
    </ul>
  `;
}