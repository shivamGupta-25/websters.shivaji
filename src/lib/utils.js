import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Cache configuration
const CACHE_CONFIG = {
    DURATION: 5 * 60 * 1000, // 5 minutes in milliseconds
    FETCH_TIMEOUT: 10000,     // 10 seconds timeout
};

// Cache storage
const cache = {
    siteContent: { data: null, timestamp: null },
    techelons: { data: null, timestamp: null },
    sponsors: { data: null, timestamp: null }
};

/**
 * Generic fetch function with caching and error handling
 * @param {string} endpoint - API endpoint
 * @param {string} cacheKey - Key to store in cache
 * @param {Function} serverFetchFn - Server-side fetch function
 */
async function fetchWithCache(endpoint, cacheKey, serverFetchFn) {
    const cacheEntry = cache[cacheKey];
    const now = Date.now();

    // Return cache if valid
    if (cacheEntry.data && cacheEntry.timestamp && (now - cacheEntry.timestamp < CACHE_CONFIG.DURATION)) {
        return cacheEntry.data;
    }

    try {
        const isServer = typeof window === 'undefined';

        if (isServer) {
            // Server-side fetch
            try {
                const data = await serverFetchFn();
                if (data) {
                    cacheEntry.data = data;
                    cacheEntry.timestamp = now;
                }
                return data;
            } catch (dbError) {
                console.error(`Error fetching ${cacheKey} from database:`, dbError);
                return cacheEntry.data || null;
            }
        } else {
            // Client-side fetch with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CACHE_CONFIG.FETCH_TIMEOUT);

            try {
                const cacheBuster = now;
                const response = await fetch(`/api/${endpoint}?_=${cacheBuster}`, {
                    signal: controller.signal,
                    headers: { 'Cache-Control': 'max-age=300' }
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`Failed to fetch ${cacheKey}: ${response.status}`);
                }

                const data = await response.json();
                cacheEntry.data = data;
                cacheEntry.timestamp = now;
                return data;
            } catch (error) {
                clearTimeout(timeoutId);

                if (error.name === 'AbortError') {
                    console.warn(`Request for ${cacheKey} timed out. Using cached data if available.`);
                    if (cacheEntry.data) {
                        return cacheEntry.data;
                    }
                }

                throw error;
            }
        }
    } catch (error) {
        console.error(`Error fetching ${cacheKey}:`, error);
        return cacheEntry.data || null;
    }
}

// Server-side fetch functions
async function fetchSiteContentFromServer() {
    const { default: connectToDatabase } = await import('@/lib/mongodb');
    const { default: SiteContent } = await import('@/models/SiteContent');

    await connectToDatabase();
    const content = await SiteContent.findOne({});

    if (!content) {
        console.warn('No site content found in database');
        return null;
    }

    return content;
}

async function fetchTechelonsFromServer() {
    const { default: connectToDatabase } = await import('@/lib/mongodb');
    const { default: TechelonsData } = await import('@/models/TechelonsData');

    await connectToDatabase();
    const data = await TechelonsData.findOne({});

    if (!data) {
        console.warn('No Techelons data found in database');
        return null;
    }

    return data;
}

async function fetchSponsorsFromServer() {
    const { default: connectToDatabase } = await import('@/lib/mongodb');
    const { default: SponsorsData } = await import('@/models/SponsorsData');

    await connectToDatabase();
    const data = await SponsorsData.findOne({});

    if (!data) {
        console.warn('No Sponsors data found in database');
        return null;
    }

    return data;
}

// Public API functions
export async function fetchSiteContent() {
    return fetchWithCache('content', 'siteContent', fetchSiteContentFromServer);
}

export async function fetchTechelonsData() {
    return fetchWithCache('techelons', 'techelons', fetchTechelonsFromServer);
}

export async function fetchSponsorsData() {
    return fetchWithCache('sponsors', 'sponsors', fetchSponsorsFromServer);
}