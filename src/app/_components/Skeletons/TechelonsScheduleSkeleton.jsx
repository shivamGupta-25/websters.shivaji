import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

// Constants for consistent loading timeouts
export const LOADING_TIMEOUT = 800;
export const CONTENT_LOADING_TIMEOUT = LOADING_TIMEOUT / 2;

// Consolidated Skeleton Components for TechelonsSchedule
const TechelonsScheduleSkeleton = {
    EventCard: () => (
        <Card className="group overflow-hidden h-full border-0 bg-white dark:bg-gray-900 shadow-md rounded-xl relative hover:shadow-lg p-0 animate-pulse">
            <CardContent className="p-0 h-full flex flex-col">
                {/* Event Image Container */}
                <div
                    className="w-full overflow-hidden relative bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
                    style={{ height: '200px', maxHeight: '16rem' }}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Skeleton className="w-full h-full" />
                    </div>
                </div>

                <div className="p-3 sm:p-4 flex flex-col flex-grow bg-white dark:bg-gray-900 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/80 transition-colors duration-200">
                    {/* Event Day */}
                    <div className="flex items-center mb-2">
                        <div className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                            <Skeleton className="h-3 w-3 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                    </div>

                    {/* Date */}
                    <div className="flex items-center mb-2">
                        <div className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                            <Skeleton className="h-3 w-3 rounded-full" />
                        </div>
                        <div className="flex flex-col">
                            <Skeleton className="h-4 w-28 mb-1" />
                            <div className="flex items-center gap-1">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-3 w-3 rounded-full" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                    </div>

                    {/* Event Title */}
                    <Skeleton className="h-5 w-5/6 mb-2 line-clamp-2 leading-tight" />

                    {/* Tagline - if available */}
                    <Skeleton className="text-xs italic mb-2 h-3 w-4/6" />

                    {/* Venue */}
                    <div className="inline-flex items-center text-xs text-muted-foreground mb-2 bg-muted/50 py-1 px-2 rounded-md">
                        <Skeleton className="h-3 w-3 mr-1.5 flex-shrink-0 rounded-full" />
                        <Skeleton className="h-3 w-40 truncate" />
                    </div>

                    {/* Description */}
                    <Skeleton className="text-muted-foreground text-xs mb-1 flex-grow line-clamp-2 h-3 w-full" />
                    <Skeleton className="text-muted-foreground text-xs mb-3 flex-grow line-clamp-2 h-3 w-5/6" />

                    {/* Speaker info */}
                    <div className="mb-2 text-xs">
                        <div className="inline-flex items-center bg-primary/5 py-1 px-2 rounded-md">
                            <Skeleton className="h-3 w-3 mr-1.5 text-primary flex-shrink-0 rounded-full" />
                            <Skeleton className="h-3 w-16 mr-1 font-medium" />
                            <Skeleton className="h-3 w-24 truncate text-muted-foreground" />
                        </div>
                    </div>

                    {/* Coordinator info */}
                    <div className="mb-3 text-xs">
                        <div className="inline-flex items-center bg-primary/5 py-1 px-2 rounded-md">
                            <Skeleton className="h-3 w-3 mr-1.5 text-primary flex-shrink-0 rounded-full" />
                            <Skeleton className="h-3 w-16 mr-1 font-medium" />
                            <Skeleton className="h-3 w-24 truncate text-muted-foreground" />
                        </div>
                    </div>

                    {/* Prize Pool Information */}
                    <div className="mb-3 text-xs">
                        <div className="inline-flex items-center bg-amber-50 dark:bg-amber-950/30 py-1 px-2 rounded-md">
                            <Skeleton className="h-3 w-3 mr-1.5 text-amber-500 flex-shrink-0 rounded-full" />
                            <Skeleton className="h-3 w-20 mr-1 font-medium text-amber-600 dark:text-amber-400" />
                            <Skeleton className="h-3 w-28 truncate text-muted-foreground" />
                        </div>
                    </div>

                    <div className="mt-auto pt-1">
                        <div className="w-full transition-all duration-200 hover:shadow-md relative overflow-hidden text-xs">
                            <Skeleton className="h-8 w-full rounded-md" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    ),

    EventGrid: ({ count = 6 }) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }, (_, i) => (
                <TechelonsScheduleSkeleton.EventCard key={i} />
            ))}
        </div>
    ),

    FilterSection: () => (
        <div className="bg-white dark:bg-gray-900 rounded-xl border p-3 mb-4 shadow-sm">
            <div className="relative">
                <Skeleton className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 rounded-full" />
                <Skeleton className="h-10 w-full rounded-md pl-9" />
                <Skeleton className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground rounded-full opacity-0" />
            </div>

            <div className="mt-3">
                <div className="flex items-center mb-2">
                    <Skeleton className="h-4 w-4 mr-2 text-primary rounded-full" />
                    <Skeleton className="text-sm font-medium h-5 w-40" />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    <Skeleton className="cursor-pointer px-2 py-1 rounded-full transition-all duration-200 hover:shadow-md h-7 w-24" />
                    <Skeleton className="cursor-pointer px-2 py-1 rounded-full transition-all duration-200 hover:shadow-md h-7 w-28" />
                    <Skeleton className="cursor-pointer px-2 py-1 rounded-full transition-all duration-200 hover:shadow-md h-7 w-32" />
                    <Skeleton className="cursor-pointer px-2 py-1 rounded-full transition-all duration-200 hover:shadow-md h-7 w-26" />
                </div>
            </div>
        </div>
    ),

    TabsList: () => (
        <div className="bg-gradient-to-r from-slate-50/80 to-slate-100/80 dark:from-slate-900/80 dark:to-slate-800/80 p-2 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm w-full sm:w-auto mx-auto flex justify-center gap-4">
            <div className="px-5 py-2.5 rounded-lg transition-all duration-400 ease-out relative overflow-hidden group min-w-32 h-8">
                <Skeleton className="h-8 w-32 rounded-lg" />
            </div>
            <div className="px-5 py-2.5 rounded-lg transition-all duration-400 ease-out relative overflow-hidden group min-w-32 h-8">
                <Skeleton className="h-8 w-32 rounded-lg" />
            </div>
        </div>
    ),

    HeadingSection: () => (
        <div className="mb-4">
            <Skeleton className="text-4xl font-bold text-center h-12 w-64 mx-auto" />
        </div>
    ),

    NoEventsFound: () => (
        <div className="text-center py-8 bg-muted/30 rounded-lg border border-border">
            <div className="mb-4 text-muted-foreground">
                <Skeleton className="h-10 w-10 mx-auto rounded-full opacity-20" />
            </div>
            <Skeleton className="text-lg font-semibold mb-2 h-7 w-48 mx-auto" />
            <Skeleton className="text-muted-foreground text-sm px-4 h-4 w-64 mx-auto mb-4" />
            <Skeleton className="mt-4 h-9 w-32 mx-auto rounded-md" />
        </div>
    ),

    ErrorFallback: () => (
        <div className="text-center py-8 max-w-md mx-auto px-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Skeleton className="h-7 w-7 text-primary rounded-full" />
            </div>
            <Skeleton className="text-lg font-semibold mb-2 h-7 w-48 mx-auto" />
            <Skeleton className="text-muted-foreground text-sm bg-muted/50 p-3 rounded-lg border shadow-sm mb-4 h-20 w-full" />
            <Skeleton className="h-9 w-32 mx-auto rounded-md" />
        </div>
    ),

    // Full page skeleton (combines all components)
    FullPage: () => (
        <section className="w-full max-w-7xl mx-auto px-4 py-6">
            <TechelonsScheduleSkeleton.HeadingSection />

            <div className="flex flex-col gap-6 mb-6">
                <TechelonsScheduleSkeleton.TabsList />
                <TechelonsScheduleSkeleton.FilterSection />
            </div>

            {/* Event Grid */}
            <TechelonsScheduleSkeleton.EventGrid count={6} />
        </section>
    )
};

export default TechelonsScheduleSkeleton; 