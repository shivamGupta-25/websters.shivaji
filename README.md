# Webster's MongoDB - Shivaji University Tech Event Platform

![Webster's](https://placeholder-for-logo.com/logo.png)

## 🚀 Overview

Webster's MongoDB is a modern web application built for managing Shivaji University's technical events, workshops, and Techelons (technical competitions). This platform provides a comprehensive solution for event registration, workshop signups, competition management, and administrative oversight.

## ✨ Features

- **Event Registration System**
  - Streamlined registration process for university tech events
  - Automated confirmation emails with registration details
  - Participant dashboard with registration status

- **Workshop Management**
  - Workshop catalog with detailed descriptions and schedules
  - Category-based filtering and search functionality
  - Capacity tracking and waitlist management

- **Techelons Competition Portal**
  - Team and individual registration options for technical competitions
  - Competition rules, guidelines, and resource distribution
  - Automated team formation and participant matching
  - File submissions for competition entries

- **Admin Dashboard**
  - Comprehensive event monitoring and analytics
  - Participant data management and export
  - Email communication tools for announcements
  - Workshop and competition scheduling tools
  - Sponsor management interface

- **Content Management**
  - Dynamic site content editing through admin interface
  - Sponsor showcase and partnership management
  - Event updates and announcements

- **UI/UX Features**
  - Responsive design optimized for all devices
  - Interactive 3D elements using Spline Tool
  - Smooth animations with Framer Motion
  - Accessible components with Radix UI
  - Toast notifications for user actions

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4 with Class Variance Authority
- **Component Libraries**:
  - Radix UI (Accordions, Dialogs, Select, etc.)
  - Headless UI (Accessible UI primitives)
- **Animations**:
  - Framer Motion for page transitions and micro-interactions
  - Spline Tool for 3D interactive elements
- **Form Handling**: React Hook Form with Zod validation
- **Notifications**: React Hot Toast for elegant notifications
- **Icons**: Heroicons and Lucide React
- **Additional Utilities**:
  - Canvas Confetti for celebration effects
  - date-fns for date manipulation
  - Swiper for touch-enabled carousels

### Backend
- **Server Framework**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Email Service**: Nodemailer for automated emails
- **File Handling**: Native file storage with custom upload API

## 📦 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn
- MongoDB connection (Atlas or local)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/websters-mongodb.git
   cd websters-mongodb
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_password
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_admin_password
   UPLOAD_DIR=path/to/upload/directory
   ```

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🔧 Project Structure

```
websters-mongodb/
├── src/
│   ├── app/                       # Next.js App Router pages
│   │   ├── page.js                # Homepage
│   │   ├── layout.js              # Root layout
│   │   ├── admin/                 # Admin dashboard
│   │   ├── api/                   # API endpoints
│   │   ├── register-options/      # Registration options
│   │   ├── techelons/             # Techelons pages
│   │   ├── techelonsregistration/ # Techelons registration
│   │   ├── workshopregistration/  # Workshop registration
│   │   └── formsubmitted/         # Submission confirmation
│   ├── components/                # Reusable UI components
│   │   └── ui/                    # UI component library
│   ├── models/                    # MongoDB schemas and models
│   │   ├── TechelonsData.js       # Techelons competition model
│   │   ├── TechelonsRegistration.js # Registration model
│   │   ├── WorkshopRegistration.js # Workshop model
│   │   ├── SiteContent.js         # Content management model
│   │   ├── SponsorsData.js        # Sponsors model
│   │   └── FileUpload.js          # File storage model
│   ├── lib/                       # Utility functions
│   │   ├── mongodb.js             # MongoDB connection
│   │   └── utils.js               # Helper functions
│   └── middleware.js              # API route protection
├── public/                        # Static assets
└── ...config files
```

## 📱 App Modules

### User-Facing Modules
- **Homepage** - Introduction to Webster's events with interactive elements
- **Registration Portal** - Multi-step registration workflow for events
- **Workshop Registration** - Dedicated registration for technical workshops
- **Techelons Registration** - Team and individual competition signups
- **Confirmation Pages** - Success and error handling for form submissions

### Admin Modules
- **Dashboard** - Overview of registrations and event metrics
- **Participant Management** - View, edit, and export participant data
- **Workshop Administration** - Manage capacity and details
- **Techelons Control** - Competition setup and participant tracking
- **Content Editor** - Update site content dynamically
- **Sponsor Management** - Add and edit sponsor information

## 🔒 Security Features

- Middleware-based route protection for admin sections
- Secure form validation with React Hook Form and Zod
- MongoDB schema validation for data integrity
- Encrypted sensitive information in database

## 🚀 Deployment

The application is optimized for deployment on Vercel or similar platforms:

```bash
npm run build
npm run start
```

For production deployment:
1. Set up proper environment variables on your hosting platform
2. Configure MongoDB Atlas for database hosting
3. Set up proper CORS and security headers
4. Enable proper caching strategies for static assets

Refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for platform-specific guidelines.

## 🧪 Future Improvements

- Implement real-time notifications with WebSockets
- Add participant authentication with JWT or NextAuth
- Integrate payment gateway for paid workshops
- Develop mobile application using React Native
- Implement analytics dashboard with detailed metrics

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- [Shivam Raj Gupta](https://github.com/shivamGupta-25) - Project Lead
