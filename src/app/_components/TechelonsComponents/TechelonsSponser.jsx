"use client";

import React, { useState, memo, useEffect, useMemo, useCallback } from "react";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { LogoCarousel } from "@/components/ui/logo-carousel";
import { Button } from "@/components/ui/button";
import ContactDialogBox from "@/app/_components/ContactDialogBox";
import Image from "next/image";
import { fetchSponsorsData } from "@/lib/utils";

// Memoized logo image component
const LogoImage = memo(({ src, alt, website, className }) => (
  <a
    href={website}
    target="_blank"
    rel="noopener noreferrer"
    className={`focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg ${!website ? 'pointer-events-none' : ''}`}
    aria-label={website ? `Visit ${alt}` : alt}
  >
    <div className="flex items-center justify-center h-16 sm:h-20 md:h-24 lg:h-28 transition-opacity hover:opacity-80">
      <Image
        src={src}
        alt={alt}
        width={300}
        height={160}
        style={{ objectFit: 'contain' }}
        className={`w-full max-w-[100px] sm:max-w-[140px] md:max-w-[180px] lg:max-w-[240px] ${className || ""}`}
        unoptimized={true}
        priority={false}
      />
    </div>
  </a>
));

LogoImage.displayName = 'LogoImage';

// Default fallback data
const DEFAULT_FALLBACK_DATA = {
  sponsors: [],
  uiContent: {
    showSection: true,
    title: "Our Partners",
    subtitle: "Sponsors & Partners",
    description: "Companies and organizations that make this event possible."
  }
};

export function TechelonsSponsors() {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [sponsorsData, setSponsorsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch sponsors data
  useEffect(() => {
    let isMounted = true;

    async function loadSponsorsData() {
      try {
        const data = await fetchSponsorsData();
        if (!isMounted) return;

        if (data) {
          setSponsorsData(data);
        } else {
          setError(true);
          setSponsorsData(DEFAULT_FALLBACK_DATA);
        }
      } catch (error) {
        console.error("Error loading sponsors data:", error);
        if (isMounted) {
          setError(true);
          setSponsorsData(DEFAULT_FALLBACK_DATA);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSponsorsData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Responsive column count handler
  const getColumnCount = useCallback(() => {
    if (typeof window === 'undefined') return 3; // Default for SSR

    const width = window.innerWidth;
    if (width < 640) return 2;      // Mobile: 1 column
    if (width < 768) return 2;      // Small tablets: 2 columns
    if (width < 1024) return 3;     // Large tablets: 3 columns
    return 4;                       // Desktop: 4 columns
  }, []);

  const [columnCount, setColumnCount] = useState(3); // Default to 3 for SSR

  // Update column count on client-side
  useEffect(() => {
    setColumnCount(getColumnCount());

    const handleResize = () => {
      setColumnCount(getColumnCount());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getColumnCount]);

  const handleContactClick = useCallback(() => {
    setContactDialogOpen(true);
  }, []);

  // Process sponsor logos
  const logoComponents = useMemo(() => {
    if (!sponsorsData?.sponsors?.length) return [];

    return sponsorsData.sponsors
      .sort((a, b) => a.priority - b.priority)
      .map(sponsor => ({
        ...sponsor,
        img: ({ className }) => (
          <LogoImage
            src={sponsor.img}
            alt={`${sponsor.name} logo`}
            website={sponsor.website}
            className={className}
            key={sponsor.id}
          />
        )
      }));
  }, [sponsorsData]);

  // Early returns
  if (isLoading) return null;
  if (!sponsorsData || sponsorsData.uiContent.showSection === false) return null;

  return (
    <section
      className="py-8 sm:py-12 md:py-16 lg:py-20"
      aria-labelledby="sponsors-heading"
    >
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="text-amber-600 text-sm mb-2 text-center w-full" role="alert">
            Something went wrong. Please refresh the page.
          </div>
        )}

        <header className="text-center">
          <GradientHeading
            variant="secondary"
            className="text-xl sm:text-2xl md:text-3xl"
            id="sponsors-heading"
          >
            {sponsorsData.uiContent.title}
          </GradientHeading>

          <div className="inline-block transition-transform hover:scale-105">
            <GradientHeading
              size="xl"
              className="text-2xl sm:text-3xl md:text-4xl"
            >
              {sponsorsData.uiContent.subtitle}
            </GradientHeading>
          </div>

          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 max-w-xs sm:max-w-sm md:max-w-lg mx-auto">
            {sponsorsData.uiContent.description}
          </p>
        </header>

        <div className="w-full mt-4 sm:mt-6" aria-label="Sponsor logos">
          {logoComponents.length > 0 ? (
            <LogoCarousel
              columnCount={columnCount}
              logos={logoComponents}
              className="px-2 sm:px-4"
            />
          ) : (
            <div className="w-full text-center text-gray-500 py-8">
              Sponsors will be announced soon
            </div>
          )}
        </div>

        <div className="flex justify-center mt-4 sm:mt-6">
          <Button
            variant="default"
            className="bg-gray-900 text-white text-sm sm:text-base py-1.5 sm:py-2 px-3 sm:px-4 rounded-full shadow-md hover:bg-gray-800 transition-all duration-300"
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