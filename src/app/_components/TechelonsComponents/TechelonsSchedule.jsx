"use client"

import { useMemo, useState, memo, useEffect, useCallback } from "react"
import { ErrorBoundary } from 'react-error-boundary'
import { ArrowRight, MapPin, Calendar, Filter, Info, User, Search, X, CalendarDays, Trophy } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { fetchTechelonsData } from "@/lib/utils"
import EventModal from "./TechelonsEventDialog"
import { formatEventDateTime } from "./EventDialog/utils"
import TechelonsScheduleSkeleton from "@/app/_components/Skeletons/TechelonsScheduleSkeleton"

// Constants
const DEFAULT_EVENT_IMAGE = "/placeholder.svg?height=160&width=320"

// Category styling configuration with colors
const CATEGORY_STYLES = {
    Ceremony: { color: "bg-primary text-primary-foreground hover:bg-primary/90" },
    Competition: { color: "bg-blue-500 text-white hover:bg-blue-600" },
    Seminar: { color: "bg-indigo-500 text-white hover:bg-indigo-600" },
    Workshop: { color: "bg-emerald-500 text-white hover:bg-emerald-600" },
    Presentation: { color: "bg-amber-500 text-white hover:bg-amber-600" },
    default: { color: "bg-gray-500 text-white hover:bg-gray-600" },
}

/**
 * Helper functions
 */
const getImagePath = (imagePath) => {
    if (!imagePath) return DEFAULT_EVENT_IMAGE
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath
    if (imagePath.startsWith("/public/")) return imagePath.replace("/public", "")
    if (imagePath === "Poster2.jpg" || imagePath === "Poster.png") return `/assets/${imagePath}`
    return imagePath.startsWith("/") ? imagePath : `/${imagePath}`
}

const getCategoryStyle = (category) => {
    if (!category) return CATEGORY_STYLES.default
    const categoryKey = Object.keys(CATEGORY_STYLES).find((key) =>
        category.toLowerCase().includes(key.toLowerCase())
    )
    return categoryKey ? CATEGORY_STYLES[categoryKey] : CATEGORY_STYLES.default
}

/**
 * Custom hook for event filtering functionality
 */
const useEventFiltering = (scheduleData) => {
    const [activeDay, setActiveDay] = useState(null)
    const [activeFilter, setActiveFilter] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")

    // Initialize activeDay once data is loaded
    useEffect(() => {
        if (scheduleData?.length > 0 && !activeDay) {
            setActiveDay(scheduleData[0].value);
        }
    }, [scheduleData, activeDay]);

    // Get unique categories for filtering
    const allCategories = useMemo(() => {
        const categories = new Set()
        scheduleData.forEach((day) => {
            day.events.forEach((event) => {
                if (event.category) categories.add(event.category)
            })
        })
        return Array.from(categories).sort()
    }, [scheduleData])

    // Filter and sort events
    const filteredEvents = useMemo(() => {
        if (!activeDay) return [];

        const currentDayEvents = scheduleData.find((day) => day.value === activeDay)?.events || []

        return currentDayEvents
            .filter((event) => {
                // Filter by category
                if (activeFilter !== "all" && event.category !== activeFilter) return false

                // Filter by search term
                if (searchTerm) {
                    const searchLower = searchTerm.toLowerCase()
                    return (
                        event.name.toLowerCase().includes(searchLower) ||
                        (event.description && event.description.toLowerCase().includes(searchLower)) ||
                        (event.venue && event.venue.toLowerCase().includes(searchLower)) ||
                        (event.speaker && event.speaker.toLowerCase().includes(searchLower))
                    )
                }

                return true
            })
            .sort((a, b) => new Date(`2023-10-27T${a.startTime}`) - new Date(`2023-10-27T${b.startTime}`))
    }, [activeDay, activeFilter, searchTerm, scheduleData])

    const resetFilters = useCallback(() => {
        setActiveFilter("all")
        setSearchTerm("")
    }, [])

    return {
        activeDay,
        setActiveDay,
        activeFilter,
        setActiveFilter,
        searchTerm,
        setSearchTerm,
        allCategories,
        filteredEvents,
        resetFilters
    }
}

/**
 * Custom hook for modal handling
 */
const useEventModal = () => {
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openEventModal = useCallback((event) => {
        setSelectedEvent(event)
        setIsModalOpen(true)
    }, [])

    const closeEventModal = useCallback(() => {
        setIsModalOpen(false)
        setTimeout(() => setSelectedEvent(null), 300) // Clear after animation
    }, [])

    return {
        selectedEvent,
        isModalOpen,
        openEventModal,
        closeEventModal
    }
}

/**
 * EventCard component for displaying event information
 */
const EventCard = memo(({ event, openEventModal, index }) => {
    const [imageError, setImageError] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    const imagePath = useMemo(() => getImagePath(event.image), [event.image])
    const categoryStyle = useMemo(() => getCategoryStyle(event.category), [event.category])
    const { formattedDate, dayOfWeek, formattedTime } = useMemo(() => formatEventDateTime(event), [event]);
    const eventDay = useMemo(() =>
        event.festDay === "day1" || event.festDay === "DAY_1" ? "Day 1" : "Day 2",
        [event.festDay])

    // When content is still loading, show the skeleton
    if (!event || Object.keys(event).length === 0) {
        return <TechelonsScheduleSkeleton.EventCard />;
    }

    // Calculate prize pool
    const prizeDisplay = event.prizes?.length > 0 ?
        event.prizes.some(prize => prize.reward && typeof prize.reward === 'string' && prize.reward.includes('₹')) ?
            (() => {
                // Extract and sum up all monetary prizes
                const totalPrize = event.prizes.reduce((total, prize) => {
                    if (prize.reward && typeof prize.reward === 'string') {
                        const match = prize.reward.match(/₹([\d,]+)/);
                        if (match && match[1]) {
                            const amount = parseInt(match[1].replace(/,/g, ''), 10);
                            return isNaN(amount) ? total : total + amount;
                        }
                    }
                    return total;
                }, 0);

                return `₹${totalPrize.toLocaleString('en-IN')} + Certificate`;
            })()
            : 'Certificates'
        : null;

    return (
        <Card
            className="group overflow-hidden h-full border-0 bg-white dark:bg-gray-900 shadow-md rounded-xl relative hover:shadow-lg p-0"
            style={{
                animationDelay: `${Math.min(index * 0.03, 0.3)}s`,
                transform: "translateZ(0)",
                transition: "transform 0.2s ease-out, box-shadow 0.2s ease-out",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateZ(0) translateY(-4px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateZ(0)";
            }}
        >
            {event.featured && (
                <Badge className="absolute top-0 right-0 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 rounded-tl-none rounded-br-none font-medium text-xs shadow-md">
                    ⭐ Featured
                </Badge>
            )}

            <CardContent className="p-0 h-full flex flex-col">
                {/* Event Image Container */}
                <div
                    className="w-full overflow-hidden relative bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
                    style={{
                        height: imageLoaded ? 'auto' : '200px',
                        maxHeight: '16rem',
                    }}
                >
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Skeleton className="w-full h-full" />
                        </div>
                    )}
                    <img
                        src={!imageError ? imagePath : DEFAULT_EVENT_IMAGE}
                        alt={event.name}
                        className={cn(
                            "w-full h-auto",
                            imageLoaded ? "opacity-100" : "opacity-0",
                            "transform transition-transform duration-300 ease-out group-hover:scale-105"
                        )}
                        onError={() => {
                            setImageError(true);
                            setImageLoaded(true);
                        }}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                    />
                </div>

                <div className="p-3 sm:p-4 flex flex-col flex-grow bg-white dark:bg-gray-900 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/80 transition-colors duration-200">
                    {/* Event Day */}
                    <div className="flex items-center mb-2">
                        <div className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                            <CalendarDays className="h-3 w-3" />
                        </div>
                        <span className="font-medium text-xs">{eventDay}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center mb-2">
                        <div className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                            <Calendar className="h-3 w-3" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-xs">{formattedDate}</span>
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">{dayOfWeek}</span>
                                {formattedTime && (
                                    <>
                                        <span className="text-xs text-muted-foreground">•</span>
                                        <span className="text-xs text-muted-foreground">{formattedTime}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Event Title */}
                    <h3 className="text-sm font-bold mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-200">
                        {event.name}
                    </h3>

                    {/* Tagline - if available */}
                    {event.tagline && (
                        <p className="text-xs text-primary italic mb-2 line-clamp-1">
                            {event.tagline}
                        </p>
                    )}

                    {/* Venue */}
                    <div className="inline-flex items-center text-xs text-muted-foreground mb-2 bg-muted/50 py-1 px-2 rounded-md">
                        <MapPin className="h-3 w-3 mr-1.5 flex-shrink-0" />
                        <span className="truncate">{event.venue}</span>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground text-xs mb-3 flex-grow line-clamp-2">
                        {event.shortDescription}
                    </p>

                    {/* Speaker info */}
                    {event.speaker && (
                        <div className="mb-2 text-xs">
                            <div className="inline-flex items-center bg-primary/5 py-1 px-2 rounded-md">
                                <User className="h-3 w-3 mr-1.5 text-primary flex-shrink-0" />
                                <span className="font-medium text-primary">Speaker:</span>
                                <span className="ml-1 truncate text-muted-foreground">{event.speaker}</span>
                            </div>
                        </div>
                    )}

                    {/* Coordinator info */}
                    {event.coordinators?.length > 0 && (
                        <div className="mb-3 text-xs">
                            <div className="inline-flex items-center bg-primary/5 py-1 px-2 rounded-md">
                                <User className="h-3 w-3 mr-1.5 text-primary flex-shrink-0" />
                                <span className="font-medium text-primary">Contact:</span>
                                <span className="ml-1 truncate text-muted-foreground">{event.coordinators[0].name}</span>
                            </div>
                        </div>
                    )}

                    {/* Prize Pool Information */}
                    {prizeDisplay && (
                        <div className="mb-3 text-xs">
                            <div className="inline-flex items-center bg-amber-50 dark:bg-amber-950/30 py-1 px-2 rounded-md">
                                <Trophy className="h-3 w-3 mr-1.5 text-amber-500 flex-shrink-0" />
                                <span className="font-medium text-amber-600 dark:text-amber-400">Prize Pool:</span>
                                <span className="ml-1 truncate text-muted-foreground">{prizeDisplay}</span>
                            </div>
                        </div>
                    )}

                    <div className="mt-auto pt-1">
                        <Button
                            onClick={() => openEventModal(event)}
                            className="w-full transition-all duration-200 hover:shadow-md relative overflow-hidden group/button text-xs"
                            variant="default"
                        >
                            <span className="flex items-center justify-center w-full relative z-10">
                                View Details
                                <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-300 ease-in-out group-hover/button:translate-x-1" />
                            </span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
})

EventCard.displayName = 'EventCard';

/**
 * Filter component for filtering events
 */
const EventFilter = memo(
    ({ categories, activeFilter, setActiveFilter, searchTerm, setSearchTerm }) => (
        <div className="bg-white dark:bg-gray-900 rounded-xl border p-3 mb-4 shadow-sm">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                    aria-label="Search events"
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            <div className="mt-3">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-primary" />
                    Filter by Category:
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                    <Badge
                        onClick={() => setActiveFilter("all")}
                        className={cn(
                            "cursor-pointer px-2 py-1 rounded-full transition-all duration-200 hover:shadow-md",
                            activeFilter === "all"
                                ? "bg-primary text-primary-foreground font-medium transform scale-105"
                                : "bg-background hover:bg-muted text-foreground border hover:border-primary/30 hover:scale-105",
                        )}
                    >
                        All Events
                    </Badge>

                    {categories.map((category) => {
                        const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.default;
                        return (
                            <Badge
                                key={category}
                                onClick={() => setActiveFilter(category)}
                                className={cn(
                                    "cursor-pointer px-2 py-1 rounded-full transition-all duration-200 hover:shadow-md",
                                    activeFilter === category
                                        ? `${style.color} transform scale-105`
                                        : "bg-background hover:bg-muted text-foreground border hover:border-primary/30 hover:scale-105",
                                )}
                            >
                                {category}
                            </Badge>
                        );
                    })}
                </div>
            </div>
        </div>
    ),
)

EventFilter.displayName = 'EventFilter';

/**
 * ErrorFallback Component for error boundary
 */
const ErrorFallback = ({ error, resetErrorBoundary }) => (
    <div className="text-center py-8 max-w-md mx-auto px-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Info className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
        <p className="text-muted-foreground text-sm bg-muted/50 p-3 rounded-lg border shadow-sm mb-4">
            {error.message}
        </p>
        <Button onClick={resetErrorBoundary} variant="outline" className="text-sm">
            Try again
        </Button>
    </div>
)

/**
 * NoEvents component to show when no events are found
 */
const NoEvents = ({ resetFilters }) => (
    <div className="text-center py-8 bg-muted/30 rounded-lg border border-border">
        <div className="mb-4 text-muted-foreground">
            <Search className="h-10 w-10 mx-auto opacity-20" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No events found</h3>
        <p className="text-muted-foreground text-sm px-4">
            Try adjusting your filters or search term to find what you're looking for.
        </p>
        <Button
            variant="outline"
            className="mt-4"
            onClick={resetFilters}
        >
            Reset filters
        </Button>
    </div>
)

/**
 * Main EventSchedule component
 */
const EventSchedule = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [techelonsData, setTechelonsData] = useState(null)
    const [dataError, setDataError] = useState(null)

    // Fetch Techelons data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchTechelonsData();
                setTechelonsData(data || null);
                if (!data) {
                    setDataError("Unable to load event data. Please try refreshing the page.");
                }
            } catch (error) {
                console.error("Error fetching Techelons data:", error);
                setDataError(error.message || "Failed to load event data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        // Simple loading timeout for better UX
        const loadingTimer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(loadingTimer);
    }, []);

    // Memoize schedule data
    const scheduleData = useMemo(() => {
        if (!techelonsData) return [];

        const FEST_DAYS = techelonsData.festDays || {};
        const festInfo = techelonsData.festInfo || {};

        return [
            {
                day: "Day 1",
                date: festInfo?.dates?.day1,
                value: FEST_DAYS?.DAY_1,
                events: techelonsData.events?.filter(event => event.festDay === FEST_DAYS?.DAY_1) || [],
            },
            {
                day: "Day 2",
                date: festInfo?.dates?.day2,
                value: FEST_DAYS?.DAY_2,
                events: techelonsData.events?.filter(event => event.festDay === FEST_DAYS?.DAY_2) || [],
            }
        ];
    }, [techelonsData]);

    // Custom hooks
    const {
        activeDay,
        setActiveDay,
        activeFilter,
        setActiveFilter,
        searchTerm,
        setSearchTerm,
        allCategories,
        filteredEvents,
        resetFilters
    } = useEventFiltering(scheduleData)

    const {
        selectedEvent,
        isModalOpen,
        openEventModal,
        closeEventModal
    } = useEventModal()

    // Error display
    if (dataError && !isLoading) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-12 px-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl w-full text-center">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Events</h3>
                    <p className="text-red-700 mb-4">{dataError}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }

    // Show skeleton when loading
    if (isLoading) {
        return <TechelonsScheduleSkeleton.FullPage />;
    }

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <section id="events" className="w-full max-w-7xl mx-auto px-4 py-6">
                <div className="mb-4">
                    <h2 className="text-4xl font-bold text-center">Event Schedule</h2>
                </div>

                <Tabs
                    value={activeDay || (scheduleData.length > 0 ? scheduleData[0].value : undefined)}
                    onValueChange={setActiveDay}
                    className="w-full"
                >
                    <div className="flex flex-col gap-6 mb-6">
                        <TabsList className="bg-gradient-to-r from-slate-50/80 to-slate-100/80 dark:from-slate-900/80 dark:to-slate-800/80 p-2 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm w-full sm:w-auto mx-auto flex justify-center gap-4">
                            {scheduleData.map((day) => (
                                <TabsTrigger
                                    key={day.value}
                                    value={day.value}
                                    className="px-5 py-2.5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md data-[state=active]:shadow-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium data-[state=active]:scale-105 data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all duration-400 ease-out hover:text-primary relative overflow-hidden group min-w-32 h-8"
                                >
                                    <span className="relative z-10 font-bold transition-transform duration-400 ease-out group-hover:translate-y-[-1px] text-sm">{day.day}</span>
                                    <span className="relative z-10 ml-2 text-xs text-muted-foreground hidden sm:inline-block group-hover:text-primary/70 transition-all duration-400 ease-out">({day.date})</span>
                                    <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out rounded-md"></span>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <EventFilter
                            categories={allCategories}
                            activeFilter={activeFilter}
                            setActiveFilter={setActiveFilter}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />
                    </div>

                    {scheduleData.map((day) => (
                        <TabsContent key={day.value} value={day.value} className="mt-0">
                            {filteredEvents.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredEvents.map((event, index) => (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            openEventModal={openEventModal}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <NoEvents resetFilters={resetFilters} />
                            )}
                        </TabsContent>
                    ))}
                </Tabs>

                {selectedEvent && (
                    <EventModal event={selectedEvent} isOpen={isModalOpen} onClose={closeEventModal} />
                )}
            </section>
        </ErrorBoundary>
    );
};

export default EventSchedule;