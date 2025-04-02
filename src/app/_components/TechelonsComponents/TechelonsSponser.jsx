"use client";

import React, { useState, memo } from "react";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { LogoCarousel } from "@/components/ui/logo-carousel";
import { Button } from "@/components/ui/button";
import ContactDialogBox from "@/app/_components/ContactDialogBox";
import Image from "next/image";

// Memoized logo image component to prevent unnecessary re-renders
const LogoImage = memo(({ src, alt, website, className }) => (
  <a href={website} target="_blank" rel="noopener noreferrer" className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg">
    <div className="flex items-center justify-center h-16 sm:h-20 md:h-24 lg:h-32 transition-opacity hover:opacity-80">
      <Image 
        src={src} 
        alt={alt}
        width={300}
        height={160}
        style={{ objectFit: 'contain' }}
        className={`w-full max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[300px] ${className || ""}`}
        unoptimized={true}
        priority={true}
      />
    </div>
  </a>
));

LogoImage.displayName = 'LogoImage';

// Moved to separate file (logos.js) in real implementation
const LOGOS = [
  { 
    name: "Sponser1", 
    id: "sponser-1",
    img: "/assets/webstersLogo.png", 
    website: "https://www.sponser1.com" 
  },
  { 
    name: "Sponser2", 
    id: "sponser-2", 
    img: "/assets/webstersLogo.png", 
    website: "https://www.sponser2.com" 
  },
  { 
    name: "Sponser3", 
    id: "sponser-3", 
    img: "/assets/webstersLogo.png", 
    website: null 
  },
  { 
    name: "Sponser4", 
    id: "sponser-4", 
    img: "/assets/webstersLogo.png", 
    website: null 
  },
];

export function TechelonsSponsors() {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  
  // Dynamically determine column count based on screen size
  const getColumnCount = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) return 1;      // Mobile: 1 column
      if (width < 768) return 2;      // Small tablets: 2 columns
      if (width < 1024) return 3;     // Large tablets: 3 columns
      return 4;                       // Desktop: 4 columns
    }
    return 3; // Default server-side value
  };
  
  const [columnCount, setColumnCount] = useState(() => getColumnCount());
  
  // Update column count on resize
  React.useEffect(() => {
    const handleResize = () => {
      setColumnCount(getColumnCount());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Process logos outside of render for better performance
  const logoComponents = React.useMemo(() => LOGOS.map(logo => ({
    ...logo,
    img: ({ className }) => (
      <LogoImage 
        src={logo.img}
        alt={`${logo.name} logo`}
        website={logo.website}
        className={className}
        key={logo.id}
      />
    )
  })), []);

  const handleContactClick = React.useCallback(() => {
    setContactDialogOpen(true);
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24" aria-labelledby="sponsors-heading">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center space-y-4 sm:space-y-6 md:space-y-8 px-4 sm:px-6 lg:px-8">
        <header className="text-center">
          <GradientHeading variant="secondary" className="text-xl sm:text-2xl md:text-3xl" id="sponsors-heading">
            Event Sponsors
          </GradientHeading>
          <div className="inline-block transition-transform hover:scale-105">
            <GradientHeading size="xl" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              Our Incredible Partners
            </GradientHeading>
          </div>
          <p className="mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-lg text-gray-600 max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl mx-auto">
            We extend our sincere gratitude to our sponsors who make this event possible. Their support enables us to create an exceptional experience for all participants.
          </p>
        </header>

        <div className="w-full mt-4 sm:mt-6 md:mt-8" aria-label="Sponsor logos carousel">
          <LogoCarousel 
            columnCount={columnCount} 
            logos={logoComponents} 
            className="px-2 sm:px-4"
          />
        </div>
        
        <div className="flex justify-center mt-4 sm:mt-6 md:mt-8 lg:mt-10">
          <Button 
            variant="default" 
            className="bg-gray-900 text-white text-sm sm:text-base py-1.5 sm:py-2 md:py-2.5 px-3 sm:px-4 md:px-6 rounded-full shadow-md hover:bg-gray-800 transition-all duration-300"
            onClick={handleContactClick}
            aria-label="Open contact dialog to become a partner"
          >
            Partner With Us
          </Button>
        </div>
      </div>
      
      <ContactDialogBox 
        open={contactDialogOpen} 
        onOpenChange={setContactDialogOpen} 
      />
    </section>
  );
}

export default TechelonsSponsors;