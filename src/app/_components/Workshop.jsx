'use client';

import { memo, useCallback, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";
import { fetchSiteContent } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import siteContent from '@/app/data/siteContent';

// Animation configurations - simplified
const animations = {
    title: {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
        }
    },
    button: {
        rest: { scale: 1 },
        hover: { scale: 1.05 },
        tap: { scale: 0.97 }
    }
};

// DetailItem component
const DetailItem = memo(({ label, value }) => (
    <p className="text-sm sm:text-base">
        <strong className="text-gray-900 dark:text-white">{label}</strong>{' '}
        <span className="text-gray-700 dark:text-gray-300">{value}</span>
    </p>
));

DetailItem.displayName = 'DetailItem';

// Workshop Skeleton component
const WorkshopSkeleton = () => (
    <div className="w-full max-w-4xl bg-white dark:bg-gray-900 shadow-xl rounded-lg overflow-hidden">
        <div className="relative w-full aspect-video">
            <Skeleton className="absolute inset-0" />
        </div>
        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
            <div className="text-center space-y-3">
                <Skeleton className="h-7 sm:h-8 md:h-9 w-3/4 mx-auto" />
                <Skeleton className="h-4 sm:h-5 w-full mx-auto" />
                <Skeleton className="h-4 w-1/3 mx-auto hidden" /> {/* For registration closed text */}
            </div>
            <div className="space-y-2 border-l-4 border-blue-500 pl-3 sm:pl-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center text-sm sm:text-base">
                        <Skeleton className="h-5 w-1/4 mr-2" />
                        <Skeleton className="h-5 w-2/3" />
                    </div>
                ))}
            </div>
            <div className="text-center">
                <Skeleton className="h-10 sm:h-11 w-32 sm:w-36 mx-auto rounded-full" />
            </div>
        </div>
    </div>
);

const Workshop = () => {
    const router = useRouter();
    const [workshopData, setWorkshopData] = useState(siteContent.workshop);
    const [isLoading, setIsLoading] = useState(true);
    const [usingFallback, setUsingFallback] = useState(false);

    // Fetch workshop data
    useEffect(() => {
        const loadContent = async () => {
            try {
                const content = await fetchSiteContent();
                if (content?.workshop) {
                    setWorkshopData(content.workshop);
                } else {
                    console.info('Using fallback workshop data');
                    setUsingFallback(true);
                }
            } catch (err) {
                console.error('Error loading workshop data:', err);
                setUsingFallback(true);
            } finally {
                setIsLoading(false);
            }
        };

        loadContent();
    }, []);

    const { title, shortDescription, details, bannerImage, isRegistrationOpen } = workshopData;

    const handleRegistration = useCallback(() => {
        router.push(isRegistrationOpen ? "/workshopregistration" : "/registrationclosed");
    }, [isRegistrationOpen, router]);

    return (
        <section
            id="workshop"
            className="container mx-auto px-4 py-8 flex flex-col items-center"
        >
            <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={animations.title}
            >
                Workshop
            </motion.h1>

            {isLoading ? (
                <WorkshopSkeleton />
            ) : (
                <div className="w-full max-w-4xl bg-white dark:bg-gray-900 shadow-xl rounded-lg overflow-hidden">
                    {usingFallback && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 text-center">
                            <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                                Using fallback content.{' '}
                                <button
                                    onClick={() => window.location.reload()}
                                    className="underline font-medium"
                                >
                                    Refresh
                                </button>
                            </p>
                        </div>
                    )}

                    <div className="relative w-full aspect-video">
                        <Image
                            src={bannerImage}
                            alt={`${title} Workshop Banner`}
                            fill
                            priority
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1024px"
                            onError={(e) => {
                                e.currentTarget.src = siteContent.workshop.bannerImage;
                            }}
                        />
                    </div>

                    <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
                        <div className="text-center space-y-3">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                                {title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mx-auto">
                                {shortDescription}
                            </p>
                            {!isRegistrationOpen && (
                                <p className="text-red-600 font-bold text-sm">Registration Closed</p>
                            )}
                        </div>

                        {details?.length > 0 && (
                            <div className="space-y-2 border-l-4 border-blue-500 pl-3 sm:pl-4">
                                {details.map((detail, index) => (
                                    <DetailItem
                                        key={index}
                                        label={detail.label}
                                        value={detail.value}
                                    />
                                ))}
                            </div>
                        )}

                        <motion.div
                            className="text-center"
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            variants={animations.button}
                        >
                            <Button
                                onClick={handleRegistration}
                                className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-full font-bold shadow"
                            >
                                {isRegistrationOpen ? "Register Now" : "Registration Closed"}
                            </Button>
                        </motion.div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default memo(Workshop);