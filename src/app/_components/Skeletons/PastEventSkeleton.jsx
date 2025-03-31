import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from 'framer-motion';

const PastEventSkeleton = () => {
    const [screenWidth, setScreenWidth] = useState(0);

    useEffect(() => {
        // Set initial width and handle resize
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        // Initial setup
        handleResize();
        window.addEventListener('resize', handleResize);

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

    // Dynamic height calculation based on aspect ratio 16/9
    const getCardHeight = () => {
        const width = getSwiperWidth();
        const numericWidth = parseInt(width);
        if (width.includes('vw')) {
            return `calc(${width} * 9 / 16)`;
        } else {
            return `${(numericWidth * 9) / 16}px`;
        }
    };

    return (
        <section id="pastevent" className="py-8 md:py-12 px-4 md:px-12 relative overflow-hidden">
            <div className="container mx-auto">
                <motion.div
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 md:mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <Skeleton className="h-10 sm:h-12 md:h-14 lg:h-16 w-48 sm:w-56 md:w-64 mx-auto rounded-lg" />
                </motion.div>

                <div className="flex justify-center">
                    {screenWidth > 0 && (
                        <div
                            className="relative"
                            style={{
                                width: getSwiperWidth(),
                                height: getCardHeight()
                            }}
                        >
                            {/* Create multiple card skeletons to mimic the card stack effect */}
                            {Array(5).fill(null).map((_, index) => (
                                <div
                                    key={index}
                                    className="absolute rounded-lg overflow-hidden shadow-xl"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        aspectRatio: '16/9',
                                        transform: `translateY(${index * -8}px) translateX(${index * 8}px) rotate(${index * 2}deg)`,
                                        zIndex: 5 - index,
                                        opacity: index === 0 ? 1 : (1 - index * 0.2)
                                    }}
                                >
                                    <Skeleton className="w-full h-full" />

                                    {/* Title and description skeletons */}
                                    {index === 0 && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-70">
                                            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                                                <div className="flex flex-col items-center">
                                                    <Skeleton className="h-6 sm:h-7 md:h-8 w-3/5 mb-2 rounded-md" />
                                                    <Skeleton className="h-3 sm:h-4 w-2/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className='text-center mt-4'>
                    <Skeleton className="h-4 w-32 mx-auto rounded-md" />
                </div>
            </div>
        </section>
    );
};

export default PastEventSkeleton;