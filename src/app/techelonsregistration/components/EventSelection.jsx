import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, MapPin, Users, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function EventSelection({ events, onSelectEvent, categories }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFeatured, setShowFeatured] = useState(false);

  // Get unique categories and group events
  const eventsByCategory = events.reduce((acc, event) => {
    const category = event.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(event);
    return acc;
  }, {});

  const uniqueCategories = Object.keys(eventsByCategory);

  // Filter events based on selected category and featured toggle
  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    const matchesFeatured = !showFeatured || event.featured;
    return matchesCategory && matchesFeatured;
  });

  // Reset featured filter when changing categories if no featured events exist
  useEffect(() => {
    if (selectedCategory !== "all" && showFeatured) {
      const hasFeaturedEvents = eventsByCategory[selectedCategory]?.some(event => event.featured);
      if (!hasFeaturedEvents) {
        setShowFeatured(false);
      }
    }
  }, [selectedCategory, eventsByCategory, showFeatured]);

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 md:text-xl">Select an Event</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 md:text-base">
          Choose the event you want to register for
        </p>
      </div>

      {/* Filter controls */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 sm:p-4">
        <div className="flex flex-col space-y-3 sm:space-y-4">
          {/* Responsive grid with proper alignment */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {/* First row: Category filter */}
            <div className="w-full">
              <Label
                htmlFor="category-filter"
                className="text-sm font-medium mb-1.5 block text-gray-700 dark:text-gray-300"
              >
                Category
              </Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger id="category-filter" className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {categories[category] || category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Second row: Featured toggle and Reset button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-1 sm:pt-0">
              {/* Featured toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured-toggle"
                  checked={showFeatured}
                  onCheckedChange={setShowFeatured}
                  className="data-[state=checked]:bg-amber-500"
                />
                <Label
                  htmlFor="featured-toggle"
                  className="cursor-pointer text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
                >
                  <Star className="h-3.5 w-3.5 text-amber-500" />
                  <span>Featured Events Only</span>
                </Label>
              </div>

              {/* Reset button */}
              {(selectedCategory !== "all" || showFeatured) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory("all");
                    setShowFeatured(false);
                  }}
                  className="text-xs h-8 ml-auto sm:ml-0"
                >
                  Reset Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"} found
      </div>

      {/* Event cards grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onSelect={onSelectEvent}
              categories={categories}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No events found with the current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, onSelect, categories }) {
  const isRegistrationOpen = event.registrationStatus === "open";
  const [festDates, setFestDates] = useState({ day1: null, day2: null });
  
  // Load fest dates for both day events
  useEffect(() => {
    const loadFestDates = async () => {
      if (event.bothDayEvent) {
        try {
          const data = await fetch('/api/techelons/festival-info').then(res => res.json());
          setFestDates({
            day1: data?.festInfo?.dates?.day1 || null,
            day2: data?.festInfo?.dates?.day2 || null
          });
        } catch (error) {
          console.error("Error loading fest dates:", error);
        }
      }
    };
    
    loadFestDates();
  }, [event.bothDayEvent]);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md flex flex-col h-full">
      <CardHeader className="pb-1">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base md:text-lg">{event.name}</CardTitle>
            {event.featured && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                <Star className="h-3 w-3" />
                <span className="text-xs">Featured</span>
              </Badge>
            )}
            {event.bothDayEvent && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100">
                <CalendarIcon className="h-3 w-3" />
                <span className="text-xs">Both Days</span>
              </Badge>
            )}
          </div>
          {event.category && (
            <Badge variant="outline" className="text-xs whitespace-nowrap">
              {categories[event.category] || event.category}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2 text-xs mt-1 md:text-sm">
          {event.shortDescription || event.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-1 flex-grow">
        <div className="space-y-1 text-xs md:text-sm">
          {!event.bothDayEvent && event.date && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <CalendarIcon className="h-3 w-3 mr-1 flex-shrink-0 md:h-4 md:w-4 md:mr-2" />
              <span className="truncate">{event.date}</span>
            </div>
          )}
          
          {event.bothDayEvent && (
            <div className="flex flex-col space-y-1 text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <CalendarIcon className="h-3 w-3 mr-1 flex-shrink-0 md:h-4 md:w-4 md:mr-2" />
                <span className="font-medium">Day 1:</span>
                <span className="ml-1 truncate">{festDates.day1 || "TBA"}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-3 w-3 mr-1 flex-shrink-0 md:h-4 md:w-4 md:mr-2 opacity-0" />
                <span className="font-medium">Day 2:</span>
                <span className="ml-1 truncate">{festDates.day2 || "TBA"}</span>
              </div>
            </div>
          )}

          {event.time && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="h-3 w-3 mr-1 flex-shrink-0 md:h-4 md:w-4 md:mr-2" />
              <span className="truncate">{event.time}</span>
            </div>
          )}

          {event.venue && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0 md:h-4 md:w-4 md:mr-2" />
              <span className="truncate">{event.venue}</span>
            </div>
          )}

          {event.teamSize && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Users className="h-3 w-3 mr-1 flex-shrink-0 md:h-4 md:w-4 md:mr-2" />
              <span className="truncate">
                {event.teamSize.min === event.teamSize.max
                  ? `${event.teamSize.min} members`
                  : `${event.teamSize.min}-${event.teamSize.max} members`}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          onClick={() => onSelect(event)}
          className="w-full text-xs py-1 md:text-sm md:py-2"
          disabled={!isRegistrationOpen}
          variant={isRegistrationOpen ? "default" : "outline"}
          size="sm"
        >
          {isRegistrationOpen ? "Register Now" : "Registration Closed"}
        </Button>
      </CardFooter>
    </Card>
  );
}