import React from 'react';

export function OrganizationSchema() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Websters - The Computer Science Society",
    "url": "https://webstersshivaji.vercel.app",
    "logo": "https://webstersshivaji.vercel.app/assets/webstersLogo.png",
    "description": "Websters is the official Computer Science Society of Shivaji College, University of Delhi. We organize workshops, hackathons, and tech events to help students learn and grow in the field of technology.",
    "sameAs": [
      "https://www.instagram.com/websters.shivaji/",
      "https://www.linkedin.com/company/websters-shivaji-college/"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "New Delhi",
      "addressRegion": "Delhi",
      "addressCountry": "India"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}

export function EventSchema({ name, startDate, endDate, location, description, image }) {
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": name,
    "startDate": startDate,
    "endDate": endDate,
    "location": {
      "@type": "Place",
      "name": location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "New Delhi",
        "addressRegion": "Delhi",
        "addressCountry": "India"
      }
    },
    "image": image,
    "description": description,
    "organizer": {
      "@type": "Organization",
      "name": "Websters - The Computer Science Society",
      "url": "https://webstersshivaji.vercel.app"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
    />
  );
} 