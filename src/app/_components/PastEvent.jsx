import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import siteContent from '../data/siteContent';
import { fetchSiteContent } from '@/lib/utils';
import PastEventSkeleton from './Skeletons/PastEventSkeleton';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';

// Import required modules
import { EffectCards, Autoplay } from 'swiper/modules';

const PastEvent = () => {
    const [screenWidth, setScreenWidth] = useState(0);
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [eventTitle, setEventTitle] = useState('');
    const [usingFallback, setUsingFallback] = useState(false);

    useEffect(() => {
        // Set initial width and handle resize
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        // Initial setup
        handleResize();
        window.addEventListener('resize', handleResize);

        // Fetch data from MongoDB with fallback to local data
        const fetchData = async () => {
            try {
                setLoading(true);
                setUsingFallback(false);
                
                // Implement request timeout with AbortController for cleaner cancellation
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                
                // Try to fetch from MongoDB first
                const dbContent = await fetchSiteContent({ signal: controller.signal });
                clearTimeout(timeoutId);
                
                if (dbContent && dbContent.pastEvents) {
                    // Use MongoDB data if available
                    setEventTitle(dbContent.pastEvents.title);
                    
                    const formattedEvents = dbContent.pastEvents.events.map((event, index) => ({
                        id: index + 1,
                        title: event.title,
                        image: event.imageUrl,
                        content: event.content || '' // Add content if available
                    }));
                    
                    setEvents(formattedEvents);
                } else {
                    // Fallback to local data
                    console.warn('Fallback to local site content for past events');
                    setUsingFallback(true);
                    const { pastEvents } = siteContent;
                    setEventTitle(pastEvents.title);
                    
                    const formattedEvents = pastEvents.events.map((event, index) => ({
                        id: index + 1,
                        title: event.title,
                        image: event.imageUrl,
                        content: event.content || ''
                    }));
                    
                    setEvents(formattedEvents);
                }
            } catch (error) {
                console.error('Error fetching past events:', error);
                // Fallback to local data on error
                setUsingFallback(true);
                const { pastEvents } = siteContent;
                setEventTitle(pastEvents.title);
                
                const formattedEvents = pastEvents.events.map((event, index) => ({
                    id: index + 1,
                    title: event.title,
                    image: event.imageUrl,
                    content: event.content || ''
                }));
                
                setEvents(formattedEvents);
            } finally {
                // Short timeout to show loading state if needed
                setTimeout(() => setLoading(false), 300);
            }
        };

        fetchData();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Dynamic swiper width based on screen size
    const getSwiperWidth = () => {
        if (screenWidth < 640) return '85vw';
        if (screenWidth < 768) return '340px';
        if (screenWidth < 1024) return '400px';
        return '450px';
    };

    // Loading state - show skeleton component
    if (loading) {
        return <PastEventSkeleton />;
    }

    return (
        <section id="pastevent" className="py-8 md:py-12 px-4 md:px-12 relative overflow-hidden">
            <div className="container mx-auto">
                <motion.h2
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 md:mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    {eventTitle}
                </motion.h2>

                <div className="flex justify-center">
                    {screenWidth > 0 && events.length > 0 && (
                        <Swiper
                            effect="cards"
                            grabCursor={true}
                            modules={[EffectCards, Autoplay]}
                            className="w-full"
                            style={{ width: getSwiperWidth() }}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true
                            }}
                            cardsEffect={{
                                slideShadows: false,
                                perSlideOffset: 8,
                                perSlideRotate: 2,
                            }}
                        >
                            {events.map((event) => (
                                <SwiperSlide
                                    key={event.id}
                                    className="relative rounded-lg overflow-hidden shadow-xl"
                                    style={{ aspectRatio: '16/9' }}
                                >
                                    <div className="relative w-full h-full group">
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 640px) 85vw, (max-width: 768px) 340px, (max-width: 1024px) 400px, 450px"
                                            priority={event.id <= 2}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-70 transition-opacity group-hover:opacity-90"></div>
                                        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-center drop-shadow-md">{event.title}</h3>
                                            <p className="text-xs sm:text-sm text-white/80 text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{event.content}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
                <p className='text-center text-sm text-gray-500 mt-4'>Swipe to see more</p>
                
                {usingFallback && (
                    <p className="text-center text-xs italic text-gray-500 mt-2">
                        Note: Using local site content. Please check your network connection and refresh the page.
                    </p>
                )}
            </div>
        </section>
    );
};

export default PastEvent;