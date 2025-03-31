"use client"

import { useEffect, useCallback, useMemo, memo, lazy, Suspense, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { getCategoryStyle } from "./constants"
import { useImageHandling } from "./hooks"
import { getEffectiveRegistrationStatus, formatEventDateTime, getImagePath } from "./utils"

// Lazy loaded components with chunk naming
const EventImage = lazy(() => import('./EventImage' /* webpackChunkName: "event-image" */));
const ActionButtons = lazy(() => import('./ActionButtons' /* webpackChunkName: "action-buttons" */));

// Import content components on-demand to reduce initial bundle size
const EventContent = lazy(() => import('./EventContent' /* webpackChunkName: "event-content" */));

// Simple loading fallback that matches component structure
const ContentLoader = memo(() => (
  <div className="animate-pulse space-y-4 p-4">
    <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
  </div>
));

ContentLoader.displayName = "ContentLoader";

// Main component optimized for performance
const EventModal = memo(({ event, isOpen, onClose }) => {
  // State for registration status
  const [registrationStatus, setRegistrationStatus] = useState('closed');
  const [isLoading, setIsLoading] = useState(false);

  // Custom hooks for image handling
  const {
    imageError,
    imageLoading,
    imageHeight,
    handleImageLoad,
    handleImageError,
    resetImage
  } = useImageHandling();

  // Memoized values to prevent unnecessary rerenders
  const imagePath = useMemo(() => (event ? getImagePath(event.image) : null), [event?.image]);
  const categoryStyle = useMemo(() => (event ? getCategoryStyle(event.category) : null), [event?.category]);
  const formattedEventDateTime = useMemo(() => (event ? formatEventDateTime(event) : null), [event]);

  // Reset image state when event changes
  useEffect(() => {
    if (isOpen) {
      resetImage();
    }
  }, [event?.id, isOpen, resetImage]);

  // Fetch registration status when event changes - optimized to prevent unnecessary fetches
  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      if (!event) return;

      setIsLoading(true);
      try {
        const status = await getEffectiveRegistrationStatus(event);
        setRegistrationStatus(status);
      } catch (error) {
        console.error('Error fetching registration status:', error);
        setRegistrationStatus('closed');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && event) {
      fetchRegistrationStatus();
    }
  }, [event, isOpen]);

  // Handle registration button click
  const handleRegister = useCallback(() => {
    if (!event || registrationStatus !== 'open') return;

    const url = event.registrationLink || `/techelonsregistration?eventId=${event.id}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [event, registrationStatus]);

  // Simple check - if no event data, don't render anything
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] p-0 overflow-hidden w-[95%] mx-auto border-border/40 bg-background/95 backdrop-blur-md rounded-xl shadow-xl transition-all duration-300 ease-in-out">
        <DialogTitle className="sr-only">{event.name}</DialogTitle>

        {/* Modal content with improved scrolling behavior */}
        <div className="max-h-[85vh] overflow-y-auto overscroll-contain scrollbar-thin">
          {/* Event image */}
          <Suspense fallback={
            <div className="h-48 md:h-56 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 animate-pulse relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
              </div>
            </div>
          }>
            <EventImage
              event={event}
              imagePath={imagePath}
              categoryStyle={categoryStyle}
              imageError={imageError}
              imageLoading={imageLoading}
              imageHeight={imageHeight}
              handleImageLoad={handleImageLoad}
              handleImageError={handleImageError}
            />
          </Suspense>

          {/* Event content */}
          <Suspense fallback={<ContentLoader />}>
            <div className="p-5 space-y-6">
              <EventContent
                event={event}
                formattedEventDateTime={formattedEventDateTime}
              />

              {/* Action buttons */}
              <ActionButtons
                event={event}
                handleRegister={handleRegister}
                registrationStatus={registrationStatus}
                isLoading={isLoading}
              />
            </div>
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  );
});

EventModal.displayName = "EventModal";

export default EventModal; 