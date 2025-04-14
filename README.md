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

- **Modern UI/UX** - Built with React 19 and Next.js 15
- **Responsive Design** - Optimized for all device sizes
- **Dynamic Content** - Content management system ready
- **Animations** - Smooth animations with Framer Motion
- **Event Registration** - Workshop and event registration system
- **Email Notifications** - Automated email notifications for registrations
- **Admin Dashboard** - Admin panel for managing content and registrations

## 🛠️ Tech Stack

- **Frontend**: React 19, Next.js 15
- **Styling**: TailwindCSS 4, Class Variance Authority
- **Animations**: Framer Motion
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form, Zod validation
- **Database**: MongoDB with Mongoose
- **Email Service**: Nodemailer
- **Deployment**: Vercel

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
│   └── assets/           # Static assets (images, fonts, etc.)
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── _components/  # Page-specific components
│   │   ├── admin/        # Admin dashboard
│   │   ├── api/          # API routes
│   │   └── data/         # Static site content
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utility functions and helpers
│   ├── models/           # MongoDB schemas
│   └── middleware.js     # Next.js middleware
├── .env                  # Environment variables
└── package.json          # Project dependencies
```

## 🌟 Key Features

### Home Page
- Animated banner showcasing society information
- About section with society history and mission
- Workshop announcements
- Past events gallery
- Council members showcase

### Event Registration
- Registration forms for workshops and events
- Email confirmation system
- WhatsApp group integration

### Admin Dashboard
- Manage site content
- View and export registrations
- Update event details

## 📝 Content Management

The website implements a hybrid content management approach:

- **API-First Strategy**: Content is primarily fetched from a backend API
- **Static Fallback System**: In case of API request failures, the application seamlessly falls back to local content stored in the `src/app/data/` directory, ensuring the content remains accessible at all times.
- **Error Handling**: Built-in error boundaries and fallback UI prevent blank screens during connectivity issues
- **Admin Panel**: Content can be managed through the admin interface at `/admin` (requires authentication)

To modify default content, edit the corresponding files in the `src/app/data/` directory.

## 📱 Progressive Web App

This website is PWA-ready, allowing users to install it on their devices for a native-like experience.

## 👨‍💻 Developer

Project developed by:

- **Shivam Raj Gupta** - Technical Head - [LinkedIn](https://www.linkedin.com/in/shivam-raj-gupta/) - [guptashivam25oct@gmail.com](mailto:guptashivam25oct@gmail.com)
