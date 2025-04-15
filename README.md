<!-- WEBSTERS - SHIVAJI COLLEGE -->

<div align="center">
  <img src="/public/assets/webstersLogo White.png" alt="Websters Logo" width="200"/>
  <h1>Websters - The Computer Science Society</h1>
  <p><strong>Shivaji College, University of Delhi</strong></p>
  
  <p>
    <a href="https://nextjs.org/">
      <img src="https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=flat-square" alt="Built with Next.js 15" />
    </a>
    <a href="https://reactjs.org/">
      <img src="https://img.shields.io/badge/React-19.0.0-blue?style=flat-square" alt="React 19.0.0" />
    </a>
    <a href="https://tailwindcss.com/">
      <img src="https://img.shields.io/badge/Styling-TailwindCSS-06B6D4?style=flat-square" alt="TailwindCSS" />
    </a>
  </p>
</div>

## 📋 Overview

Websters is the official Computer Science Society of Shivaji College, University of Delhi. Established in 1984, we are dedicated to fostering academic excellence and intellectual growth in the field of computer science. Our website serves as a digital platform for our community, showcasing our events, workshops, and activities.

## ✨ Features

- **Modern UI/UX** - Built with React 19 and Next.js 15 App Router
- **Responsive Design** - Optimized for all device sizes with Tailwind CSS 4
- **Event Management**
  - Workshop registration system with email confirmations
  - Techelons event registration with team/individual options and email confirmations to all participants
  - WhatsApp group integration for event communication
  - Event sharing functionality across social media platforms
- **Admin Dashboard**
  - Protected admin area with authentication
  - Content management for site sections
  - Event management and registration monitoring
  - Comprehensive analytics of registrations and events
  - QR code generation for registration links without third-party dependencies
  - Unused file management to optimize storage and performance
  - Sponsor management
- **Animations** - Interactive UI with Framer Motion and Spline 3D
- **Error Handling** - Robust form validation with Zod and React Hook Form
- **Email Notifications** - Automated email system with customized templates
- **Performance Optimization** - Vercel Analytics and Speed Insights integration

## 🛠️ Tech Stack

- **Frontend**
  - React 19
  - Next.js 15 (App Router)
  - TailwindCSS 4
  - shadcn/ui
  - Framer Motion for animations
  - Spline for 3D animations
  - Swiper for carousels
  - Canvas Confetti for celebrations
  - React Intersection Observer for scroll animations
- **UI Components**
  - Radix UI primitives (Dialog, Accordion, Tabs, etc.)
  - Headless UI components
  - Heroicons and Lucide React for icons
  - Class Variance Authority for component variants
- **Form Handling**
  - React Hook Form
  - Zod validation
  - React Hot Toast for notifications
- **Data Visualization**
  - Recharts for analytics graphs
  - Date-fns for date formatting
- **Database**
  - MongoDB with Mongoose ODM
- **Authentication**
  - Custom middleware-based authentication system
- **Email Service**
  - Nodemailer with custom HTML templates
- **Monitoring**
  - Vercel Analytics and Speed Insights
- **Development Tools**
  - React Error Boundary for error handling

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/websters-shivaji.git
   cd websters-shivaji
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   ```
   # Create a .env file in the root directory and add the following variables
   MONGODB_URI=your_mongodb_uri
   EMAIL_SERVICE=your_email_service
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_password
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_admin_password
   ```

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## 📁 Project Structure

```
websters-shivaji/
├── public/
│   └── assets/           # Static assets (images, logos, etc.)
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── _components/  # Page-specific components
│   │   ├── admin/        # Admin dashboard features
│   │   │   ├── analytics/           # Analytics dashboard
│   │   │   ├── login/               # Admin authentication
│   │   │   ├── techelons-events/    # Event management
│   │   │   ├── workshop/            # Workshop management
│   │   │   └── sponsors/            # Sponsor management
│   │   ├── api/          # API routes
│   │   │   ├── admin/               # Admin API endpoints
│   │   │   ├── techelons/           # Techelons API endpoints
│   │   │   └── workshop/            # Workshop API endpoints
│   │   ├── email/        # Email service templates
│   │   └── data/         # Fallback static site content
│   ├── components/       # Reusable UI components
│   │   └── ui/           # UI component library
│   ├── lib/              # Utility functions and helpers
│   ├── models/           # MongoDB schemas
│   │   ├── TechelonsData.js         # Techelons event schema
│   │   ├── TechelonsRegistration.js # Event registration schema
│   │   ├── SiteContent.js           # Site content schema
│   │   ├── SponsorsData.js          # Sponsors schema
│   │   └── WorkshopRegistration.js  # Workshop registration schema
│   └── middleware.js     # Next.js middleware for auth and protection
├── .env                  # Environment variables
└── package.json          # Project dependencies
```

## 🌟 Key Features Explained

### Home Page
- Animated banner
- About section describing the society
- Workshop announcements with registration links
- Past events gallery with Swiper carousels
- Council members showcase with animations

### Event Registration System
- **Workshop Registration**
  - Form validation with Zod schemas
  - Duplicate registration prevention
  - Email confirmation
  
- **Techelons Event Registration**
  - Support for both individual and team events
  - Dynamic team size validation based on event requirements
  - Comprehensive validation for participant details
  - Duplicate registration prevention
  - Duplicate registration detection across team members
  - Email confirmations with event details

### Admin Dashboard
- **Authentication System**
  - Secure login with session management
  - Middleware protection for admin routes
  
- **Analytics Dashboard**
  - Registration statistics by event, course, college, and date
  - Visual charts with Recharts
  
- **Content Management**
  - Update site various sections and pages
  - Edit workshop details and registration status
  - Manage Techelons event details and status
  - Sponsor management with logo uploads

### Email Notification System
- Customized HTML templates for different events
- WhatsApp group links in confirmation emails
- Error handling and fallback mechanisms

### Fallback Mechanisms
- **API-First Strategy**: Content is primarily fetched from the MongoDB database
- **Static Fallback System**: In case of API failures, the application falls back to local content stored in the `src/app/data/` directory
- **Error Handling**: Comprehensive error boundaries prevent blank screens during connectivity issues

## 📱 Progressive Enhancement

The website is built with progressive enhancement in mind:
- Core functionality works without JavaScript
- Enhanced experience with JavaScript enabled
- Responsive design adapts to all device sizes
- Optimized for performance with Vercel Speed Insights

## 👨‍💻 Developer

Project developed by:

- **Shivam Raj Gupta** - Technical Head - [LinkedIn](https://www.linkedin.com/in/shivam-raj-gupta/) - [guptashivam25oct@gmail.com](mailto:guptashivam25oct@gmail.com)

## 📞 Contact

- **LinkedIn**: [Shivam Raj Gupta](https://www.linkedin.com/in/shivam-raj-gupta/)
- **Email**: guptashivam25oct@gmail.com
