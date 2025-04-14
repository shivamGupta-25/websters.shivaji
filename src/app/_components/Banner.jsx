'use client';

import React, { useEffect, useState, memo } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { fetchSiteContent } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import siteContent from '@/app/data/siteContent';

// Use fallback data from siteContent file
const FALLBACK_BANNER_CONTENT = siteContent.banner;

// Animation variants
const animations = {
    container: {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] }
        }
    },
    content: {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.2 }
        }
    },
    image: {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.4 }
        }
    }
};

const BannerSkeleton = () => (
    <section className="container px-8 mx-auto flex flex-col justify-center my-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center text-center w-full md:pl-10">
                <Skeleton className="text-6xl md:text-8xl lg:text-9xl font-bold h-14 md:h-20 lg:h-24 w-3/4 mb-2" />
                <Skeleton className="text-sm md:text-xl h-4 md:h-5 w-1/2 mb-2" />
                <Skeleton className="text-xl md:text-2xl h-6 md:h-7 w-2/3 mb-4" />
                <div className="py-6 w-full space-y-2 mb-2 max-w-2xl mx-auto">
                    <Skeleton className="h-4 md:h-5 w-full" />
                    <Skeleton className="h-4 md:h-5 w-full" />
                    <Skeleton className="h-4 md:h-5 w-4/5" />
                </div>
                <Skeleton className="p-6 rounded-[30px] shadow-lg h-12 w-40 mt-4" />
            </div>
            <div className="flex items-center justify-center">
                <Skeleton className="h-[280px] w-[280px] md:h-[350px] md:w-[350px] rounded-full drop-shadow-[0px_8px_10px_rgba(0,0,0,0.2)]" />
            </div>
        </div>
    </section>
);

const Banner = () => {
    const router = useRouter();
    const controls = useAnimation();
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
    const [bannerContent, setBannerContent] = useState(FALLBACK_BANNER_CONTENT);
    const [isLoading, setIsLoading] = useState(true);
    const [usingFallback, setUsingFallback] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadContent = async () => {
            try {
                const content = await fetchSiteContent();

                if (isMounted && content?.banner) {
                    setBannerContent(prev => ({ ...prev, ...content.banner }));
                } else if (isMounted) {
                    // If no content is returned from API, use the imported fallback
                    console.info('Using local fallback content from siteContent.js');
                    setBannerContent(FALLBACK_BANNER_CONTENT);
                    setUsingFallback(true);
                }
            } catch (error) {
                console.error('Error loading banner content:', error);
                if (isMounted) {
                    setUsingFallback(true);
                    // On error, ensure we use the imported fallback
                    setBannerContent(FALLBACK_BANNER_CONTENT);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadContent();
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    if (isLoading) {
        return <BannerSkeleton />;
    }

    // Ensure all required fields have values, prioritizing API data but falling back to siteContent data
    const displayContent = bannerContent || FALLBACK_BANNER_CONTENT;

    // Safe content length limiting
    const safeContent = {
        ...displayContent,
        title: displayContent.title?.length > 20 ? `${displayContent.title.substring(0, 20)}...` : displayContent.title,
        subtitle: displayContent.subtitle?.length > 50 ? `${displayContent.subtitle.substring(0, 50)}...` : displayContent.subtitle,
        description: displayContent.description?.length > 300 ? `${displayContent.description.substring(0, 300)}...` : displayContent.description
    };

    return (
        <section ref={ref} className="container px-8 mx-auto flex flex-col justify-center my-4 mb-12">
            {usingFallback && (
                <div className="text-amber-600 text-sm mb-2 text-center">
                    Using local fallback content due to connection issues. Please refresh to try again.
                </div>
            )}
            <div className="text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3 sm:p-4 mx-auto max-w-3xl my-2 sm:my-4 shadow-sm">
                <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center space-x-2 text-center">
                        <span className="text-amber-500 text-lg sm:text-xl">⚠️</span>
                        <h2 className="font-semibold text-base sm:text-lg md:text-xl">This is not the official Websters website</h2>
                    </div>

                    <p className="text-xs sm:text-sm md:text-base text-center px-2">
                        This is a development testing site of the official Websters website.
                    </p>

                    <p className="text-xs sm:text-sm md:text-base text-center px-2">
                        Please visit the official Websters website <br/> at{" "}
                        <a
                            href="https://websters-shivaji.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200"
                        >
                            websters-shivaji.vercel.app
                        </a>
                    </p>

                    <div className="text-xs sm:text-sm md:text-base text-center mt-1 sm:mt-2 px-2">
                        <p className="mb-1">
                            Both this testing site and the official website are made with{" "}
                            <span className="text-red-500">❤️</span>
                            {" "}by
                        </p>
                        <div className="flex flex-wrap justify-center items-center gap-1">
                            <span className="font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded inline-flex items-center text-xs sm:text-sm">
                                Shivam Raj Gupta
                                <a
                                    href="https://www.linkedin.com/in/shivam-raj-gupta/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-amber-700 hover:text-amber-900 ml-1 sm:ml-2"
                                    aria-label="LinkedIn Profile"
                                >
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3v9zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                                    </svg>
                                </a>
                                <a
                                    href="mailto:guptashivam25oct@gmail.com"
                                    className="text-amber-700 hover:text-amber-900 ml-1 sm:ml-2"
                                    aria-label="Email"
                                >
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                    </svg>
                                </a>
                            </span>
                        </div>
                        <p className="mt-1">
                            for Websters - The Computer Science Society, Shivaji College, University of Delhi.
                        </p>
                    </div>
                </div>
            </div>
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                initial="hidden"
                animate={controls}
                variants={animations.container}
            >
                <motion.div
                    className="flex flex-col items-center text-center w-full md:pl-10"
                    variants={animations.content}
                >
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold">{safeContent.title}</h1>
                    <h2 className="text-sm md:text-xl font-normal">{safeContent.subtitle}</h2>
                    <h3 className="text-xl md:text-2xl">{safeContent.institution}</h3>
                    <p className="py-6 text-base md:text-lg max-w-2xl mx-auto">{safeContent.description}</p>
                    <Button
                        onClick={() => router.push(safeContent.buttonLink)}
                        className="p-6 rounded-[30px] shadow-lg hover:scale-105 transition-all text-lg font-bold tracking-wide mt-4"
                    >
                        {safeContent.buttonText}
                    </Button>
                </motion.div>

                <motion.div
                    className="flex items-center justify-center"
                    variants={animations.image}
                >
                    <Image
                        alt={`${safeContent.institution} Logo`}
                        src={safeContent.logoImage}
                        width={350}
                        height={350}
                        priority
                        className="drop-shadow-[0px_8px_10px_rgba(0,0,0,0.9)]"
                        loading="eager"
                        sizes="(max-width: 768px) 280px, 350px"
                        onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='350' height='350' viewBox='0 0 350 350'%3E%3Crect width='350' height='350' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3ELogo%3C/text%3E%3C/svg%3E";
                        }}
                    />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default memo(Banner);