# Dr. A Dental Clinic - Management System

## Overview
A full-stack dental clinic management web application for Dr. A Dental Clinic. It handles patient bookings, clinic services management, appointment scheduling, automated email reminders, and admin dashboards.

## Tech Stack
- **Frontend**: React 19, React Router 7, Styled Components, Framer Motion, Lucide React, Chart.js
- **Backend/Database**: Firebase (Firestore, Authentication, Cloud Functions)
- **Email**: EmailJS (client-side), SendGrid (via Firebase Cloud Functions)
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Package Manager**: npm

## Project Structure
```
/
├── src/
│   ├── App.js              # Main app with routing
│   ├── index.js            # Entry point
│   ├── pages/
│   │   ├── Landing.js      # Landing/splash page
│   │   ├── Home.js         # Home page
│   │   ├── Services.js     # Clinic services
│   │   ├── KnowUs.js       # About us
│   │   ├── RecentActivities.js
│   │   ├── Contact.js      # Contact page
│   │   ├── Book.js         # Patient booking system
│   │   ├── Admin.js        # Admin login/dashboard
│   │   ├── AdminCalendar.js
│   │   ├── AdminCalendarSettings.js
│   │   ├── AdminComments.js
│   │   ├── AdminStats.js
│   │   ├── AdminServices.js
│   │   └── firebase.js     # Firebase initialization
│   └── components/
│       ├── Header.js
│       ├── Footer.js
│       └── Sidebar.js
├── functions/              # Firebase Cloud Functions (email reminders)
└── public/                 # Static assets
```

## Routes
- `/` - Landing page
- `/home` - Home
- `/services` - Services listing
- `/know-us` - About the clinic
- `/recent-activities` - Recent activities
- `/contact` - Contact info
- `/book-now` - Patient booking
- `/admin` - Admin login
- `/admin/calendar` - Appointment calendar
- `/admin/calendar-settings` - Calendar settings
- `/admin/comments` - Patient comments
- `/admin/stats` - Statistics dashboard
- `/admin/services` - Services management

## Firebase Configuration
Firebase config is hardcoded in `src/pages/firebase.js` for the `dr-a-dental-clinic` project.

## Environment Variables
- `VITE_EMAILJS_SERVICE_ID` - EmailJS service ID
- `VITE_EMAILJS_TEMPLATE_ID` - EmailJS template ID
- `VITE_EMAILJS_PUBLIC_KEY` - EmailJS public key

## Development Setup
```bash
npm install
npm start  # Runs on port 5000, host 0.0.0.0
```

## Deployment
- Type: Static site
- Build command: `npm run build`
- Output directory: `build/`
