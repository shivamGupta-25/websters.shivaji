import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Cache for site content
let siteContentCache = null;
let techelonsDataCache = null;
let sponsorsDataCache = null;
let siteContentCacheTimestamp = null;
let techelonsDataCacheTimestamp = null;
let sponsorsDataCacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // Increased to 5 minutes in milliseconds

// Function to fetch site content with improved caching
export async function fetchSiteContent() {
    // Check if cache is valid
    if (siteContentCache && siteContentCacheTimestamp && (Date.now() - siteContentCacheTimestamp < CACHE_DURATION)) {
        return siteContentCache;
    }

    try {
        // Determine if we're in a browser or server environment
        const isServer = typeof window === 'undefined';

        if (isServer) {
            // In server environment, use absolute URL with the host from environment variable
            // or connect directly to the database
            try {
                const { default: connectToDatabase } = await import('@/lib/mongodb');
                const { default: SiteContent } = await import('@/models/SiteContent');

                await connectToDatabase();
                const content = await SiteContent.findOne({});

                if (!content) {
                    console.warn('No site content found in database');
                    return null;
                }

                siteContentCache = content;
                siteContentCacheTimestamp = Date.now();
                return content;
            } catch (dbError) {
                console.error('Error connecting to database during build:', dbError);
                // During build time, return null instead of throwing an error
                return null;
            }
        } else {
            // In browser environment, use relative URL with cache-busting parameter
            // Use AbortController to properly cancel the fetch request on timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            try {
                const cacheBuster = Date.now();
                const response = await fetch(`/api/content?_=${cacheBuster}`, {
                    signal: controller.signal,
                    // Add cache control headers
                    headers: {
                        'Cache-Control': 'max-age=300' // 5 minutes
                    }
                });

                // Clear the timeout since fetch completed
                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error('Failed to fetch site content');
                }

                const data = await response.json();
                siteContentCache = data;
                siteContentCacheTimestamp = Date.now();
                return data;
            } catch (error) {
                // Clear the timeout if there was an error
                clearTimeout(timeoutId);

                // Handle abort error specifically
                if (error.name === 'AbortError') {
                    console.warn('Request timed out after 5 seconds. Attempting to use cached data.');
                    // If we have cached data, return it even if it's expired
                    if (siteContentCache) {
                        console.warn('Returning cached site content data due to timeout');
                        return siteContentCache;
                    }
                }

                // Re-throw other errors to be caught by the outer try-catch
                throw error;
            }
        }
    } catch (error) {
        console.error('Error fetching site content:', error);

        // If we have cached data, return it even if it's expired
        if (siteContentCache) {
            console.warn('Returning expired cached site content due to fetch error');
            return siteContentCache;
        }

        return null;
    }
}

// Function to fetch Techelons data with improved error handling and caching
export async function fetchTechelonsData() {
    // Check if cache is valid
    const now = Date.now();
    const isCacheValid = techelonsDataCache && techelonsDataCacheTimestamp && (now - techelonsDataCacheTimestamp < CACHE_DURATION);

    if (isCacheValid) {
        return techelonsDataCache;
    }

    try {
        // Determine if we're in a browser or server environment
        const isServer = typeof window === 'undefined';

        if (isServer) {
            // In server environment, connect directly to the database
            const { default: connectToDatabase } = await import('@/lib/mongodb');
            const { default: TechelonsData } = await import('@/models/TechelonsData');

            await connectToDatabase();
            const data = await TechelonsData.findOne({});

            if (!data) {
                console.warn('No Techelons data found in database');
                return null;
            }

            techelonsDataCache = data;
            techelonsDataCacheTimestamp = now;
            return data;
        } else {
            // In browser environment, use relative URL with timeout and cache-busting
            // Use AbortController to properly cancel the fetch request on timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort();
            }, 5000);

            try {
                // Create the fetch promise with abort signal and cache-busting parameter
                const cacheBuster = Date.now();
                const response = await fetch(`/api/techelons?_=${cacheBuster}`, {
                    signal: controller.signal,
                    // Add cache control headers
                    headers: {
                        'Cache-Control': 'max-age=300' // 5 minutes
                    }
                });

                // Clear the timeout since fetch completed
                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`Failed to fetch Techelons data: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();

                // Update cache
                techelonsDataCache = data;
                techelonsDataCacheTimestamp = now;

                return data;
            } catch (error) {
                // Clear the timeout if there was an error
                clearTimeout(timeoutId);

                // Handle abort error specifically
                if (error.name === 'AbortError') {
                    console.warn('Request timed out after 5 seconds. Attempting to use cached data.');
                    // If we have cached data, return it even if it's expired
                    if (techelonsDataCache) {
                        console.warn('Returning cached Techelons data due to timeout');
                        return techelonsDataCache;
                    }
                    // Only throw if we have no cached data
                    throw new Error('Request timed out after 5 seconds. Please check your network connection and try again.');
                }

                // Re-throw other errors to be caught by the outer try-catch
                throw error;
            }
        }
    } catch (error) {
        console.error('Error fetching Techelons data:', error);

        // If we have cached data, return it even if it's expired
        if (techelonsDataCache) {
            console.warn('Returning expired cached Techelons data due to fetch error');
            return techelonsDataCache;
        }

        return null;
    }
}

// Function to fetch Sponsors data with improved error handling and caching
export async function fetchSponsorsData() {
    // Check if cache is valid
    const now = Date.now();
    const isCacheValid = sponsorsDataCache && sponsorsDataCacheTimestamp && (now - sponsorsDataCacheTimestamp < CACHE_DURATION);

    if (isCacheValid) {
        return sponsorsDataCache;
    }

    try {
        // Determine if we're in a browser or server environment
        const isServer = typeof window === 'undefined';

        if (isServer) {
            // In server environment, connect directly to the database
            const { default: connectToDatabase } = await import('@/lib/mongodb');
            const { default: SponsorsData } = await import('@/models/SponsorsData');

            await connectToDatabase();
            const data = await SponsorsData.findOne({});

            if (!data) {
                console.warn('No Sponsors data found in database');
                return null;
            }

            sponsorsDataCache = data;
            sponsorsDataCacheTimestamp = now;
            return data;
        } else {
            // In browser environment, use relative URL with timeout and cache-busting
            // Use AbortController to properly cancel the fetch request on timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort();
            }, 5000);

            try {
                // Create the fetch promise with abort signal and cache-busting parameter
                const cacheBuster = Date.now();
                const response = await fetch(`/api/sponsors?_=${cacheBuster}`, {
                    signal: controller.signal,
                    // Add cache control headers
                    headers: {
                        'Cache-Control': 'max-age=300' // 5 minutes
                    }
                });

                // Clear the timeout since fetch completed
                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`Failed to fetch Sponsors data: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();

                // Update cache
                sponsorsDataCache = data;
                sponsorsDataCacheTimestamp = now;

                return data;
            } catch (error) {
                // Clear the timeout if there was an error
                clearTimeout(timeoutId);

                // Handle abort error specifically
                if (error.name === 'AbortError') {
                    console.warn('Request timed out after 5 seconds. Attempting to use cached data.');
                    // If we have cached data, return it even if it's expired
                    if (sponsorsDataCache) {
                        console.warn('Returning cached Sponsors data due to timeout');
                        return sponsorsDataCache;
                    }
                    // Only throw if we have no cached data
                    throw new Error('Request timed out after 5 seconds. Please check your network connection and try again.');
                }

                // Re-throw other errors to be caught by the outer try-catch
                throw error;
            }
        }
    } catch (error) {
        console.error('Error fetching Sponsors data:', error);

        // If we have cached data, return it even if it's expired
        if (sponsorsDataCache) {
            console.warn('Returning expired cached Sponsors data due to fetch error');
            return sponsorsDataCache;
        }

        return null;
    }
}