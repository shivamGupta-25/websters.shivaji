import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay } from 'swiper/modules';
import { fetchSiteContent } from '@/lib/utils';
import siteContent from '@/app/data/siteContent';
import PastEventSkeleton from './Skeletons/PastEventSkeleton';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/autoplay';

export default function PastEvent() {
    const [pastEvents, setPastEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [usingFallback, setUsingFallback] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadPastEvents = async () => {
            try {
                // Attempt to fetch from MongoDB
                const data = await fetchSiteContent();

                if (!isMounted) return;

                if (data?.pastEvents?.events?.length > 0) {
                    setPastEvents(data.pastEvents.events);
                    setUsingFallback(false);
                } else {
                    // Fallback to local data
                    setPastEvents(siteContent.pastEvents.events);
                    setUsingFallback(true);
                }
            } catch (error) {
                console.error('Error loading past events:', error);
                if (isMounted) {
                    setPastEvents(siteContent.pastEvents.events);
                    setUsingFallback(true);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadPastEvents();
        return () => { isMounted = false; };
    }, []);

    if (isLoading) {
        return <PastEventSkeleton />;
    }

    if (!pastEvents.length) {
        return <div className="flex justify-center py-8">No events to display</div>;
    }

    return (
        <section id="pastevent" className="py-8 md:py-12 px-4 md:px-12 relative overflow-hidden">
            <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 md:mb-10">
                Past Events
            </h2>

            {usingFallback && (
                <div className="text-amber-600 text-sm mb-4 text-center">
                    Using local fallback content due to connection issues. Please refresh to try again.
                </div>
            )}

            <div className="flex justify-center">
                {/* Increased width for larger screens */}
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                    <Swiper
                        effect="cards"
                        grabCursor={true}
                        modules={[EffectCards, Autoplay]}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        className="w-full aspect-video"
                    >
                        {pastEvents.map((event, index) => (
                            <SwiperSlide
                                key={index}
                                className="rounded-lg overflow-hidden flex items-center justify-center relative group"
                            >
                                <img
                                    src={event.imageUrl}
                                    alt={event.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                                    <h3 className="text-lg md:text-xl font-bold text-white text-center shadow">
                                        {event.title}
                                    </h3>
                                    {event.content && (
                                        <p className="text-xs md:text-sm text-white/80 text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {event.content}
                                        </p>
                                    )}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <p className="text-center text-lg text-gray-500 mt-4 italic">Swipe to see more events</p>
                </div>
            </div>
        </section>
    );
}