/**
 * Firebase Cloud Function to send reminder emails for appointments
 * 
 * Deploy with:
 * firebase deploy --only functions:sendReminderEmails
 * 
 * Setup required:
 * 1. Install dependencies: npm install nodemailer firebase-admin
 * 2. Set SendGrid API key: firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY"
 * 3. Or use environment variables for email configuration
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

// Configure nodemailer with SendGrid
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY || functions.config().sendgrid?.key
  }
});

// Valid admin keys
const VALID_KEYS = {
  'admin123': true,
  'matina123': true,
  'sasa123': true
};

exports.sendReminderEmails = functions.https.onRequest(async (request, response) => {
  // Enable CORS
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST');
  response.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    response.status(204).send('');
    return;
  }

  try {
    // Verify admin authentication
    const { reminders, adminKey } = request.body;

    if (!adminKey || !VALID_KEYS[adminKey]) {
      return response.status(401).json({
        success: false,
        error: 'Unauthorized access'
      });
    }

    if (!reminders || !Array.isArray(reminders) || reminders.length === 0) {
      return response.status(400).json({
        success: false,
        error: 'No reminders provided'
      });
    }

    // Send emails to each patient
    let sentCount = 0;
    const failures = [];

    for (const reminder of reminders) {
      try {
        const appointmentDate = new Date(reminder.appointmentDate);
        const formattedDate = appointmentDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });

        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: 'Inter', Arial, sans-serif; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #4a3728, #6d4c41); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; }
                .content { background: #f9f5f2; padding: 30px; border-radius: 0 0 12px 12px; }
                .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4a3728; }
                .detail-row { margin: 12px 0; font-size: 15px; }
                .detail-label { color: #a1887f; font-weight: 600; font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 4px; }
                .detail-value { color: #4a3728; font-weight: 600; font-size: 16px; }
                .button { display: inline-block; background: #4a3728; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; margin-top: 20px; font-weight: 600; }
                .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #a1887f; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>📅 Appointment Reminder</h1>
                </div>
                <div class="content">
                  <p>Hi <strong>${reminder.fullName}</strong>,</p>
                  
                  <p>This is a friendly reminder about your upcoming appointment at <strong>Dr. A Dental Clinic</strong>.</p>
                  
                  <div class="details">
                    <div class="detail-row">
                      <span class="detail-label">Appointment Date</span>
                      <span class="detail-value">${formattedDate}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Service</span>
                      <span class="detail-value">${reminder.reason}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Branch</span>
                      <span class="detail-value" style="text-transform: capitalize;">${reminder.branch}</span>
                    </div>
                  </div>
                  
                  <p><strong>Please arrive 10 minutes early</strong> to complete any necessary paperwork.</p>
                  
                  <p>If you need to reschedule or cancel, please contact us at <strong>${reminder.phone}</strong> or reply to this email.</p>
                  
                  <p>We look forward to seeing you!</p>
                  
                  <p>Best regards,<br><strong>Dr. A Dental Clinic Team</strong></p>
                  
                  <div class="footer">
                    <p>© 2026 Dr. A Dental Clinic. All rights reserved.</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `;

        const mailOptions = {
          from: 'noreply@dradentalclinic.com',
          to: reminder.email,
          subject: `Appointment Reminder - ${formattedDate}`,
          html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        sentCount++;
      } catch (error) {
        console.error(`Failed to send email to ${reminder.email}:`, error);
        failures.push({
          email: reminder.email,
          error: error.message
        });
      }
    }

    response.json({
      success: true,
      sentCount,
      totalAttempted: reminders.length,
      failures: failures.length > 0 ? failures : undefined
    });

  } catch (error) {
    console.error('Error in sendReminderEmails:', error);
    response.status(500).json({
      success: false,
      error: error.message
    });
  }
});
