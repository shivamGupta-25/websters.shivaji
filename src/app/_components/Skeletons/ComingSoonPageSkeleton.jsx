import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton component for loading state
const ComingSoonPageSkeleton = () => {
  return (
    <section className="py-8 md:py-8 relative flex items-center justify-center">
      {/* Particle effect placeholder */}
      <div className="absolute inset-0 z-0">
        {Array(10).fill(0).map((_, i) => (
          <div 
            key={i}
            className="absolute bg-gray-200/20 rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Decorative elements placeholder */}
      <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-tr-full z-0"></div>
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-bl from-purple-500/10 to-indigo-500/10 rounded-bl-full z-0"></div>

      {/* Main content skeleton */}
      <div className="z-10 text-center w-full max-w-4xl px-4">
        <div className="mb-8 inline-block">
          {/* Heading skeleton */}
          <Skeleton className="h-16 sm:h-20 md:h-24 lg:h-28 w-64 sm:w-72 md:w-80 lg:w-96 rounded-lg" />
          {/* Heading underline skeleton */}
          <Skeleton className="h-1.5 w-20 sm:w-24 md:w-28 lg:w-32 mx-auto mt-2 md:mt-3 rounded-full" />
        </div>

        {/* Coming Soon title skeleton */}
        <Skeleton 
          className="h-8 sm:h-10 md:h-12 w-48 sm:w-56 md:w-64 mx-auto mb-4 sm:mb-5 md:mb-6 rounded-lg" 
        />

        {/* Description text skeletons */}
        <Skeleton 
          className="h-4 sm:h-5 md:h-6 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto mb-3 rounded" 
        />
        <Skeleton 
          className="h-4 sm:h-5 md:h-6 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl w-3/4 mx-auto mb-3 rounded" 
        />
        <Skeleton 
          className="h-4 sm:h-5 md:h-6 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl w-1/2 mx-auto mb-6 sm:mb-8 md:mb-10 rounded" 
        />

        <Skeleton 
          className="h-4 sm:h-5 md:h-6 w-40 sm:w-44 md:w-48 mx-auto mb-6 sm:mb-8 md:mb-10 rounded" 
        />

        {/* Social links skeleton */}
        <div className="flex justify-center gap-4 sm:gap-5 md:gap-6">
          <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
          <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
        </div>

        {/* Back to home button skeleton */}
        <div className="mt-10 sm:mt-12 md:mt-16 flex justify-center">
          <Skeleton className="h-10 sm:h-12 w-48 sm:w-56 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default ComingSoonPageSkeleton; 