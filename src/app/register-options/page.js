"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTechelonsData, fetchSiteContent } from '@/lib/utils';

export default function RegisterOptions() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [siteData, setSiteData] = useState(null);
  const [techelonsData, setTechelonsData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [siteContent, techelonsData] = await Promise.all([
          fetchSiteContent(),
          fetchTechelonsData()
        ]);
        
        console.log("DEBUG - Loaded data in register-options:");
        console.log("DEBUG - siteContent:", siteContent);
        console.log("DEBUG - techelonsData:", techelonsData);
        
        setSiteData(siteContent);
        setTechelonsData(techelonsData);
        setDataLoaded(true);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Check if both registrations are open, if not redirect to the appropriate page
  useEffect(() => {
    if (!dataLoaded) return;

    console.log("DEBUG - Register Options - Data loaded");
    console.log("DEBUG - techelonsData:", techelonsData);
    console.log("DEBUG - siteData:", siteData);

    // Check if the data structure is as expected
    if (!techelonsData || !techelonsData.festInfo) {
      console.error("DEBUG - techelonsData or festInfo is missing");
      return;
    }

    if (!siteData || !siteData.workshop) {
      console.error("DEBUG - siteData or workshop is missing");
      return;
    }

    const techelonsRegistrationOpen = techelonsData.festInfo.registrationEnabled;
    const workshopRegistrationOpen = siteData.workshop.isRegistrationOpen;

    console.log("DEBUG - techelonsRegistrationOpen:", techelonsRegistrationOpen);
    console.log("DEBUG - workshopRegistrationOpen:", workshopRegistrationOpen);

    if (!techelonsRegistrationOpen && !workshopRegistrationOpen) {
      console.log("DEBUG - Redirecting to registrationclosed");
      router.push("/registrationclosed");
    } else if (techelonsRegistrationOpen && !workshopRegistrationOpen) {
      console.log("DEBUG - Redirecting to techelonsregistration");
      router.push("/techelonsregistration");
    } else if (!techelonsRegistrationOpen && workshopRegistrationOpen) {
      console.log("DEBUG - Redirecting to workshopregistration");
      router.push("/workshopregistration");
    } else {
      console.log("DEBUG - Both registrations are open, staying on register-options page");
      setLoading(false);
    }
  }, [router, dataLoaded, siteData, techelonsData]);

  if (loading || !dataLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-12 lg:py-16 max-w-7xl">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-5 md:mb-6 lg:mb-8">Choose Registration Type</h1>
      <p className="text-center text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 md:mb-10 lg:mb-12 max-w-2xl mx-auto px-2">
        We have multiple events open for registration. Please select the event you want to register for.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10 max-w-5xl mx-auto">
        {/* Workshop Registration Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full p-0 w-full">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg p-3 sm:p-4 md:p-5 lg:p-6">
            <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl">Workshop Registration</CardTitle>
            <CardDescription className="text-blue-100 text-xs sm:text-sm md:text-base">
              {siteData.workshop.title}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-3 sm:pt-4 md:pt-5 pb-2 md:pb-3 flex-grow px-3 sm:px-4 md:px-5">
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <div className="flex items-start">
                <span className="text-blue-500 mr-2 mt-0.5 text-lg">📅</span>
                <div className="flex-1">
                  <p className="font-medium text-xs sm:text-sm md:text-base">Date</p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {siteData.workshop.details.find(d => d.id === 'date')?.value || 'To be announced'}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-blue-500 mr-2 mt-0.5 text-lg">🏛️</span>
                <div className="flex-1">
                  <p className="font-medium text-xs sm:text-sm md:text-base">Venue</p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {siteData.workshop.details.find(d => d.id === 'venue')?.value || 'To be announced'}
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 md:mt-3 line-clamp-3 sm:line-clamp-none">
                {siteData.workshop.shortDescription}
              </p>
            </div>
          </CardContent>
          <CardFooter className="pt-1 sm:pt-2 pb-3 sm:pb-4 md:pb-5 px-3 sm:px-4 md:px-5">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm md:text-base py-1.5 sm:py-2 md:py-2.5 min-h-10 rounded-md"
              onClick={() => router.push("/workshopregistration")}
            >
              Register for Workshop
            </Button>
          </CardFooter>
        </Card>

        {/* Techelons Registration Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full p-0 w-full">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg p-3 sm:p-4 md:p-5 lg:p-6">
            <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl">Techelons Registration</CardTitle>
            <CardDescription className="text-purple-100 text-xs sm:text-sm md:text-base">
              Techelons 2025 - Annual Tech Fest
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-3 sm:pt-4 md:pt-5 pb-2 md:pb-3 flex-grow px-3 sm:px-4 md:px-5">
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <div className="flex items-start">
                <span className="text-purple-500 mr-2 mt-0.5 text-lg">📅</span>
                <div className="flex-1">
                  <p className="font-medium text-xs sm:text-sm md:text-base">Dates</p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {techelonsData.festInfo.dates.day1} - {techelonsData.festInfo.dates.day2}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-purple-500 mr-2 mt-0.5 text-lg">🏆</span>
                <div className="flex-1">
                  <p className="font-medium text-xs sm:text-sm md:text-base">Events</p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {techelonsData.events.length} Technical & Non-Technical Events
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 md:mt-3 line-clamp-3 sm:line-clamp-none">
                Join us for an exciting tech fest featuring competitions, workshops, and amazing prizes!
              </p>
            </div>
          </CardContent>
          <CardFooter className="pt-1 sm:pt-2 pb-3 sm:pb-4 md:pb-5 px-3 sm:px-4 md:px-5">
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm md:text-base py-1.5 sm:py-2 md:py-2.5 min-h-10 rounded-md"
              onClick={() => router.push("/techelonsregistration")}
            >
              Register for Techelons
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 