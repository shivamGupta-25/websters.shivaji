// NOTE: This file was automatically updated to use fetchTechelonsData instead of importing from techelonsData directly.
// Please review and update the component to use the async fetchTechelonsData function.
import { fetchTechelonsData } from '@/lib/utils';

// Cache for techelons data with a shorter cache duration
let cachedTechelonsData = null;
let cacheTimestamp = null;
const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes

/**
 * Get the image path for an event
 * 
 * @param {string} imagePath - The image path from the event object
 * @returns {string} - The processed image path
 */
export const getImagePath = (imagePath) => {
  const DEFAULT_EVENT_IMAGE = '/assets/default-event.jpg';

  if (!imagePath) return DEFAULT_EVENT_IMAGE;
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("/public/")) return imagePath.replace("/public", "");
  if (!imagePath.startsWith("/")) return `/${imagePath}`;
  return imagePath;
};

/**
 * Get the effective registration status for an event, taking into account
 * both the master registrationEnabled flag and the individual event's status
 * 
 * @param {Object} event - The event object
 * @returns {Promise<string>} - The effective registration status
 */
export const getEffectiveRegistrationStatus = async (event) => {
  if (!event) return 'closed';

  try {
    // Check if cache is valid
    const now = Date.now();
    const isCacheValid = cachedTechelonsData && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION);

    // Use cached data or fetch new data
    if (!isCacheValid) {
      cachedTechelonsData = await fetchTechelonsData();
      cacheTimestamp = now;
    }

    // If no data, default to closed
    if (!cachedTechelonsData) return 'closed';

    const { festInfo } = cachedTechelonsData;

    // Check if registration is globally disabled
    if (!festInfo?.registrationEnabled) return 'closed';

    // Return event-specific status or default to open
    return event.registrationStatus || 'open';
  } catch (error) {
    return 'closed';
  }
};

/**
 * Format event date and time into a user-friendly format
 * 
 * @param {Object} event - The event object
 * @returns {Object} - Formatted date, time, and day of week
 */
export const formatEventDateTime = (event) => {
  if (!event) {
    return { formattedDate: "TBA", formattedTime: "TBA", dayOfWeek: "" };
  }

  // Default values
  let formattedDate = "TBA";
  let formattedTime = event.time || "TBA";
  let dayOfWeek = "";

  // Format date if available
  if (event.date) {
    try {
      const dateObj = new Date(event.date);

      if (!isNaN(dateObj.getTime())) {
        // Format date: April 10, 2025
        formattedDate = dateObj.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });

        // Get day of week
        dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
      } else {
        formattedDate = event.date;
      }
    } catch (error) {
      formattedDate = event.date;
    }
  }

  return { formattedDate, formattedTime, dayOfWeek };
}; 