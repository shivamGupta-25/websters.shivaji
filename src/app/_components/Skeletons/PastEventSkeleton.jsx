import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export default function PastEventSkeleton() {
    return (
        <section className="py-8 md:py-12 px-4 md:px-12 relative overflow-hidden">
            {/* Skeleton header */}
            <Skeleton className="h-10 w-64 mx-auto mb-6 md:mb-10" />

            <div className="flex justify-center">
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                    {/* Skeleton swiper card stack - mimicking cards effect */}
                    <div className="relative w-full aspect-video">
                        {/* Main card */}
                        <Skeleton className="w-full aspect-video shadow-md absolute z-10" />

                        {/* Background cards to simulate stack */}
                        <Skeleton className="w-full aspect-video opacity-80 shadow-md absolute top-2 left-2 z-0 transform rotate-3" />
                        <Skeleton className="w-full aspect-video opacity-60 shadow-md absolute top-4 left-4 z-0 transform rotate-6" />

                        {/* Skeleton content for the main card */}
                        <div className="absolute inset-0 z-20 flex flex-col justify-end p-3">
                            <Skeleton className="h-6 w-36 mx-auto mb-2" />
                            <Skeleton className="h-3 w-48 mx-auto opacity-60" />
                        </div>
                    </div>

                    {/* Skeleton guide text */}
                    <Skeleton className="h-5 w-48 mx-auto mt-4" />
                </div>
            </div>
        </section>
    );
}
