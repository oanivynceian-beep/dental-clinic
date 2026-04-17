# Appointment Reminder Email Setup Guide

## Overview
This feature sends reminder emails to patients on their appointment date. The "Send Reminders" button is now available in the Admin Calendar modal when viewing a day with appointments.

## Prerequisites
- Firebase project created and configured
- Firebase CLI installed (`npm install -g firebase-tools`)
- Node.js and npm installed
- SendGrid account (free tier available)

## Step-by-Step Setup

### 1. Create a SendGrid Account
1. Go to https://sendgrid.com
2. Sign up for a free account
3. Verify your email
4. Create a new API key:
   - Settings → API Keys → Create API Key
   - Choose "Restricted Access"
   - Grant "Mail Send" permission only
   - Copy the API key

### 2. Set Up Firebase Cloud Functions

#### 2a. Initialize Firebase Functions (if not already done)
```bash
cd dental-clinic
firebase init functions
# Choose Node.js runtime
# Choose JavaScript
```

#### 2b. Install Required Dependencies
```bash
cd functions
npm install nodemailer firebase-admin
```

#### 2c. Set Environment Variables
Replace the SendGrid API key with your actual key:
```bash
firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY"
```

#### 2d. Deploy the Cloud Function
Copy the provided `sendReminderEmails.js` to `functions/` directory if not already there.

Deploy the function:
```bash
firebase deploy --only functions:sendReminderEmails
```

After deployment, Firebase will provide a URL like:
```
https://us-central1-dr-a-dental-clinic.cloudfunctions.net/sendReminderEmails
```

### 3. Update the Admin Calendar Component
The component is already configured to use the Cloud Function URL. If your project name is different, update line with the Cloud Function URL in `src/pages/AdminCalendar.js`:

```javascript
const response = await fetch('https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/sendReminderEmails', {
  // ...
});
```

### 4. Configure Sender Email
In `functions/sendReminderEmails.js`, update the sender email:
```javascript
from: 'noreply@yourdomain.com', // Change this to your clinic's email or SendGrid validated sender
```

**Important:** You must verify this email in SendGrid:
1. Go to Settings → Sender Authentication
2. Verify Domain or Single Sender Address
3. Follow SendGrid's verification process

### 5. Test the Feature

1. Go to Admin Calendar
2. Log in with your admin credentials (e.g., admin123)
3. Click on a day with appointments
4. Click the "Send Reminders" button
5. A notification will appear confirming emails were sent

## How It Works

1. Admin clicks "Send Reminders" button on a day with appointments
2. The button collects all booking information for patients on that day
3. An HTTP POST request is sent to the Cloud Function with:
   - Patient emails
   - Appointment details
   - Admin authentication key
4. The Cloud Function:
   - Verifies the admin key
   - Connects to SendGrid
   - Sends personalized HTML emails to each patient
   - Returns success/failure status
5. A toast notification shows how many emails were sent

## Email Template Customization

The email template is in `functions/sendReminderEmails.js` in the `htmlContent` variable. You can customize:
- Colors (currently using clinic brand colors #4a3728, #6d4c41)
- Content and messaging
- Logo/branding
- Layout and styling

## Troubleshooting

### Function not found error
- Ensure Cloud Function is deployed: `firebase deploy --only functions:sendReminderEmails`
- Check the URL matches your Firebase project ID

### Authentication error (401)
- Verify admin key is correct (admin123, matina123, or sasa123)
- Check `VALID_KEYS` in the Cloud Function matches your passwords

### Email not sending (but success response)
- Check SendGrid API key is valid
- Verify sender email is authenticated in SendGrid
- Check spam folder for test emails
- Review SendGrid activity log for bounces

### "No reminders provided" error
- Ensure the day has bookings
- Check that bookings have valid email addresses

### Function timeout
- SendGrid request taking too long
- Check network connectivity
- Increase function timeout in `firebase.json` (set `timeoutSeconds: 300`)

## Security Notes

1. API key is stored in Firebase Functions environment, not exposed
2. Only valid admin keys can trigger emails
3. CORS is configured for your domain only
4. Consider adding rate limiting if scaling

## Monitoring Emails

You can track sent emails in:
1. **SendGrid Dashboard**: Mail Activity → View all stats and bounces
2. **Firebase Console**: Functions → Logs (see execution details)
3. **Browser Console**: Developer tools show request/response details

## Next Steps (Optional Enhancements)

- [ ] Schedule daily reminders via Cloud Scheduler
- [ ] Send reminders 24 hours before appointment automatically
- [ ] Add email templates management in admin panel
- [ ] Track which emails were opened/clicked
- [ ] Add SMS reminders as alternative to email
- [ ] Resend failed emails with retry logic

## Support

For issues:
1. Check Firebase Console for function logs
2. Review SendGrid activity logs
3. Verify environment variables: `firebase functions:config:get`
4. Test locally: `firebase emulators:start`
