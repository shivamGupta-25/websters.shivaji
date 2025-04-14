"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { fetchTechelonsData as fetchTechelonsDataUtil } from "@/lib/utils";
import techelonsDataFallback from "@/app/data/techelonsData"; // Import fallback data

// Ensure fallback includes comingSoonEnabled property
if (techelonsDataFallback && techelonsDataFallback.festInfo) {
  if (techelonsDataFallback.festInfo.comingSoonEnabled === undefined) {
    techelonsDataFallback.festInfo.comingSoonEnabled = false;
  }
}

// Ensure fallback includes whatsappGroups property
if (techelonsDataFallback && !techelonsDataFallback.whatsappGroups) {
  techelonsDataFallback.whatsappGroups = { default: '' };
}

// Import Alert Dialog components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Import components
import GeneralSettings from "./components/GeneralSettings";
import EventsList from "./components/EventsList";
import AddEvent from "./components/AddEvent";

export default function TechelonsManagement() {
  const router = useRouter();
  const [techelonsData, setTechelonsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUsingFallbackData, setIsUsingFallbackData] = useState(false);

  const [newEvent, setNewEvent] = useState({
    id: "",
    name: "",
    shortDescription: "",
    tagline: "",
    description: "",
    image: "",
    category: "",
    venue: "",
    festDay: "",
    date: "",
    time: "",
    duration: "",
    registrationStatus: "open",
    teamSize: { min: 1, max: 1 },
    prizes: [{ position: "1st", reward: "Certificate" }],
    coordinators: [{ name: "", email: "", phone: "" }],
    rules: [""],
    instructions: "",
    resources: "",
    whatsappGroup: "",
    competitionStructure: [{ 
      title: "Round 1", 
      description: "", 
      tasks: [""] 
    }],
    evaluationCriteria: [""]
  });

  // Load Techelons data on component mount
  useEffect(() => {
    const fetchTechelonsData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTechelonsDataUtil();

        if (data) {
          // Initialize comingSoonEnabled if it doesn't exist
          if (data.festInfo && data.festInfo.comingSoonEnabled === undefined) {
            data.festInfo.comingSoonEnabled = false;
          }
          
          // Initialize whatsappGroups if it doesn't exist
          if (!data.whatsappGroups) {
            data.whatsappGroups = { default: '' };
          }
          
          setTechelonsData(data);
          setIsUsingFallbackData(false);
        } else {
          throw new Error('Failed to fetch Techelons data');
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching Techelons data:', error);
        toast.error('Failed to load Techelons data');

        // Initialize with fallback structure from imported data
        setTechelonsData(techelonsDataFallback);
        setIsUsingFallbackData(true);

        setIsLoading(false);
      }
    };

    fetchTechelonsData();
  }, []);

  // Track unsaved changes
  useEffect(() => {
    if (!isLoading && techelonsData) {
      setHasUnsavedChanges(true);
    }
  }, [techelonsData, isLoading]);

  // Handle general info changes
  const handleFestInfoChange = (field, value) => {
    setTechelonsData(prev => ({
      ...prev,
      festInfo: {
        ...prev.festInfo,
        [field]: value
      }
    }));
  };

  // Handle top-level field changes
  const handleTopLevelFieldChange = (field, value) => {
    setTechelonsData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle date changes
  const handleDateChange = (dateType, value) => {
    setTechelonsData(prev => ({
      ...prev,
      festInfo: {
        ...prev.festInfo,
        dates: {
          ...prev.festInfo.dates,
          [dateType]: value
        }
      }
    }));
  };

  // Handle event changes
  const handleEventChange = (index, field, value) => {
    setTechelonsData(prev => {
      const updatedEvents = [...prev.events];

      if (field === 'teamSize.min' || field === 'teamSize.max') {
        const [mainField, subField] = field.split('.');
        updatedEvents[index] = {
          ...updatedEvents[index],
          [mainField]: {
            ...updatedEvents[index][mainField],
            [subField]: parseInt(value, 10) || 1
          }
        };
      } else {
        updatedEvents[index] = {
          ...updatedEvents[index],
          [field]: value
        };
      }

      return {
        ...prev,
        events: updatedEvents
      };
    });
  };

  // Handle new event changes
  const handleNewEventChange = (field, value) => {
    if (field === 'teamSize.min' || field === 'teamSize.max') {
      const [mainField, subField] = field.split('.');
      setNewEvent(prev => ({
        ...prev,
        [mainField]: {
          ...prev[mainField],
          [subField]: parseInt(value, 10) || 1
        }
      }));
    } else {
      setNewEvent(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Add new event
  const addEvent = () => {
    // Add the new event
    setTechelonsData(prev => ({
      ...prev,
      events: [...prev.events, { ...newEvent }]
    }));

    // Reset the form
    setNewEvent({
      id: "",
      name: "",
      shortDescription: "",
      tagline: "",
      description: "",
      image: "",
      category: "",
      venue: "",
      festDay: "",
      date: "",
      time: "",
      duration: "",
      registrationStatus: "open",
      teamSize: { min: 1, max: 1 },
      prizes: [{ position: "1st", reward: "Certificate" }],
      coordinators: [{ name: "", email: "", phone: "" }],
      rules: [""],
      instructions: "",
      resources: "",
      whatsappGroup: "",
      competitionStructure: [{ 
        title: "Round 1", 
        description: "", 
        tasks: [""] 
      }],
      evaluationCriteria: [""]
    });

    toast.success("Event added successfully");

    // Switch to events tab after adding
    setActiveTab("events");
  };

  // Open delete dialog
  const openDeleteDialog = (index) => {
    setEventToDelete(index);
    setDeleteDialogOpen(true);
  };

  // Confirm event removal
  const confirmRemoveEvent = () => {
    if (eventToDelete !== null) {
      setTechelonsData(prev => ({
        ...prev,
        events: prev.events.filter((_, i) => i !== eventToDelete)
      }));

      toast.success("Event removed successfully");
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  // Save all changes
  const saveTechelonsData = async () => {
    try {
      setIsSaving(true);

      const response = await fetch('/api/techelons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(techelonsData),
      });

      if (!response.ok) {
        throw new Error('Failed to save Techelons data');
      }

      toast.success('Techelons data saved successfully');
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving Techelons data:', error);
      toast.error('Failed to save Techelons data');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset image to placeholder
  const resetImageToPlaceholder = (index) => {
    handleEventChange(index, "image", "");
    toast.success("Image reset");
  };

  // Reset new event image to placeholder
  const resetNewEventImage = () => {
    setNewEvent(prev => ({
      ...prev,
      image: ""
    }));
    toast.success("Image reset");
  };

  const refreshPage = () => {
    router.refresh();
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 md:px-6 py-4 max-w-7xl mx-auto">
      {isUsingFallbackData && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-amber-700 font-medium">
              Using fallback data due to API error. Some features may be limited.
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshPage}
            className="text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Page
          </Button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Techelons Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage Techelons fest details, events, and registration settings
          </p>
        </div>
        <Button 
          onClick={saveTechelonsData} 
          disabled={isSaving || !hasUnsavedChanges}
          className="w-full sm:w-auto"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {hasUnsavedChanges ? "Save Changes" : "No Changes"}
            </>
          )}
        </Button>
      </div>

      <Separator />

      <Tabs defaultValue="general" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
        <div className="overflow-x-auto pb-2">
          <TabsList className="grid w-full grid-cols-3 sm:w-[400px]">
            <TabsTrigger value="general" className="text-sm">General</TabsTrigger>
            <TabsTrigger value="events" className="text-sm">
              Events
              {techelonsData.events.length > 0 && (
                <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {techelonsData.events.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="add-event" className="text-sm">Add Event</TabsTrigger>
          </TabsList>
        </div>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4 mt-2">
          <GeneralSettings
            techelonsData={techelonsData}
            handleFestInfoChange={handleFestInfoChange}
            handleTopLevelFieldChange={handleTopLevelFieldChange}
            handleDateChange={handleDateChange}
          />
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4 mt-2">
          <EventsList
            techelonsData={techelonsData}
            handleEventChange={handleEventChange}
            removeEvent={openDeleteDialog}
            resetImageToPlaceholder={resetImageToPlaceholder}
          />
        </TabsContent>

        {/* Add Event Tab */}
        <TabsContent value="add-event" className="space-y-4 mt-2">
          <AddEvent
            newEvent={newEvent}
            handleNewEventChange={handleNewEventChange}
            addEvent={addEvent}
            resetNewEventImage={resetNewEventImage}
            techelonsData={techelonsData}
          />
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveEvent} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 