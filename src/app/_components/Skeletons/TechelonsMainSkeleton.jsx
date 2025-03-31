import { Skeleton } from "@/components/ui/skeleton";

// Consolidated Skeleton Components
const TechelonsSkeleton = {
    StatusBadge: () => (
        <div className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 rounded-full bg-gray-100 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
            <Skeleton className="h-5 w-36 rounded-md" />
        </div>
    ),

    Heading: () => (
        <>
            <div className="inline-block relative">
                <Skeleton className="h-12 sm:h-14 md:h-16 lg:h-20 xl:h-24 w-64 sm:w-72 md:w-80 lg:w-96 xl:w-[28rem] mx-auto" />
                <div className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-blue-600/0 via-purple-600 to-indigo-600/0 blur-sm" aria-hidden="true"></div>
            </div>
            <Skeleton className="h-5 sm:h-6 md:h-7 lg:h-8 w-full max-w-2xl mx-auto mt-3 sm:mt-4 md:mt-5 lg:mt-6" />
        </>
    ),

    MobileBanner: () => (
        <div className="relative bg-gradient-to-br from-black to-indigo-950 py-10 px-4">
            <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full opacity-20 blur-3xl bg-blue-500/30" aria-hidden="true"></div>
            <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full opacity-20 blur-3xl bg-purple-500/30" aria-hidden="true"></div>
            <div className="relative text-center">
                <Skeleton className="h-8 sm:h-10 w-48 mx-auto mb-2 bg-white/20" />
                <Skeleton className="h-4 sm:h-5 w-32 sm:w-36 mx-auto mb-3 bg-white/20" />
                <Skeleton className="h-4 w-64 mx-auto bg-white/20" />
            </div>
        </div>
    ),

    AboutSection: () => (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-xl border border-gray-100">
            <Skeleton className="h-6 sm:h-7 md:h-8 w-40 sm:w-48 md:w-56 mx-auto mb-2 sm:mb-3" />
            <Skeleton className="h-3 sm:h-4 md:h-5 w-full mb-2" />
            <Skeleton className="h-3 sm:h-4 md:h-5 w-full mb-2" />
            <Skeleton className="h-3 sm:h-4 md:h-5 w-full mb-2" />
            <Skeleton className="h-3 sm:h-4 md:h-5 w-3/4" />
        </div>
    ),

    ExploreSection: () => (
        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-xl">
            <Skeleton className="h-6 sm:h-7 md:h-8 w-48 sm:w-56 md:w-64 mx-auto mb-2 sm:mb-3 bg-white/20" />
            <Skeleton className="h-3 sm:h-4 md:h-5 w-full mb-2 bg-white/20" />
            <Skeleton className="h-3 sm:h-4 md:h-5 w-3/4 mb-3 sm:mb-4 bg-white/20" />
            <div className="flex flex-col xs:flex-row justify-center items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                <Skeleton className="h-8 sm:h-9 md:h-10 w-full xs:w-32 md:w-36 rounded-full bg-white/20" />
                <Skeleton className="h-8 sm:h-9 md:h-10 w-full xs:w-32 md:w-36 rounded-full bg-white/20" />
            </div>
        </div>
    ),

    Scene3D: () => (
        <div className="relative w-full h-full bg-gradient-to-br from-black to-indigo-950 rounded-2xl overflow-hidden shadow-2xl border border-indigo-900/20">
            <div className="absolute top-1/4 left-1/4 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-blue-500/30 rounded-full opacity-20 blur-3xl" aria-hidden="true"></div>
            <div className="absolute top-1/2 right-1/4 w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-purple-500/30 rounded-full opacity-20 blur-3xl" aria-hidden="true"></div>

            <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
                <div className="text-white text-center">
                    <Skeleton className="h-10 sm:h-12 md:h-14 lg:h-16 xl:h-18 w-48 sm:w-56 md:w-64 lg:w-72 mx-auto mb-2 bg-white/20" />
                    <Skeleton className="h-4 sm:h-5 md:h-6 lg:h-7 w-32 sm:w-36 md:w-40 lg:w-44 mx-auto mb-2 sm:mb-3 md:mb-4 lg:mb-6 bg-white/20" />
                    <div className="flex justify-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400/50 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400/50 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 bg-blue-400/50 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                </div>
            </div>
        </div>
    ),

    FeatureCard: () => (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <Skeleton className="h-8 md:h-10 lg:h-12 w-8 md:w-10 lg:w-12 mb-2 md:mb-4" />
            <Skeleton className="h-5 md:h-6 lg:h-7 w-1/2 mb-1 md:mb-2" />
            <Skeleton className="h-3 md:h-4 w-full" />
            <Skeleton className="h-3 md:h-4 w-3/4 mt-1" />
        </div>
    )
};

export default TechelonsSkeleton;