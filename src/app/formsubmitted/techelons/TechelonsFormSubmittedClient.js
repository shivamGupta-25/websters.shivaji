"use client";

import { useState, useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Safe base64 decode function that works in both client and server environments
function safeBase64Decode(str) {
  try {
    // For client-side
    if (typeof window !== 'undefined' && window.atob) {
      return window.atob(str);
    }
    
    // For server-side
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(str, 'base64').toString();
    }
    
    // Fallback
    return str;
  } catch (error) {
    console.error("Error decoding base64:", error);
    return str; // Return the original string as fallback
  }
}

export default function TechelonsFormSubmittedClient({ token, alreadyRegistered, eventId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const fetchRegistrationData = async () => {
      if (!token) {
        setError("Invalid registration token");
        setLoading(false);
        return;
      }

      try {
        // Decode base64 token to get email using the safe function
        const email = safeBase64Decode(token);
        console.log("Decoded email from token:", email);
        
        if (!email || !email.includes('@')) {
          throw new Error("Invalid email in token");
        }
        
        // Build API URL with email and eventId if available
        let apiUrl = `/api/techelons/registration-details?email=${encodeURIComponent(email)}`;
        if (eventId) {
          apiUrl += `&eventId=${encodeURIComponent(eventId)}`;
        }
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          let errorMessage = "Failed to fetch registration data";
          try {
            const errorData = await response.json();
            if (errorData && errorData.error) {
              errorMessage = errorData.error;
            }
          } catch (jsonError) {
            console.error("Error parsing error response:", jsonError);
          }
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        if (!data || !data.registration) {
          throw new Error("No registration data found");
        }
        
        setRegistrationData(data.registration);
        setEventData(data.event);
      } catch (error) {
        console.error("Error fetching registration data:", error);
        setError(error.message || "Failed to fetch registration data");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationData();
  }, [token, eventId]);

  return (
    <CardContent className="space-y-6">
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <Alert className={alreadyRegistered ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}>
            <div className="flex items-center gap-2">
              {alreadyRegistered ? (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              <AlertTitle className={alreadyRegistered ? "text-amber-700" : "text-green-700"}>
                {alreadyRegistered ? "Already Registered" : "Form Submitted Successfully"}
              </AlertTitle>
            </div>
            <AlertDescription className="mt-2">
              {alreadyRegistered
                ? "You have already registered for this event. Your registration details are shown below."
                : "Your registration has been confirmed. Please check your email for confirmation."}
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3">Event Details</h3>
            <div className="space-y-2">
              <p><strong>Event:</strong> {eventData?.name || registrationData?.eventName}</p>
              {eventData?.description && (
                <p><strong>Description:</strong> {eventData.description}</p>
              )}
              {eventData?.date && (
                <p><strong>Date:</strong> {eventData.date}</p>
              )}
              {eventData?.time && (
                <p><strong>Time:</strong> {eventData.time}</p>
              )}
              {eventData?.venue && (
                <p><strong>Venue:</strong> {eventData.venue}</p>
              )}
              {eventData?.whatsappGroup && (
                <div className="mt-4">
                  <p className="font-medium mb-2">Join WhatsApp Group for Updates:</p>
                  <a 
                    href={eventData.whatsappGroup} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Join WhatsApp Group
                  </a>
                </div>
              )}
            </div>
          </div>

          {registrationData?.isTeamEvent && registrationData?.teamName && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Team Information</h3>
              <p><strong>Team Name:</strong> {registrationData.teamName}</p>
            </div>
          )}
        </>
      )}
    </CardContent>
  );
} 