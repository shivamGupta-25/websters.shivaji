import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import toast from "react-hot-toast";
import EventFormSection from "./EventFormSection";

export default function AddEvent({ 
  newEvent, 
  handleNewEventChange, 
  addEvent, 
  resetNewEventImage, 
  techelonsData 
}) {
  // Validate required fields before adding event
  const validateEvent = () => {
    if (!newEvent.id || !newEvent.name || !newEvent.category || !newEvent.festDay) {
      toast.error("Please fill in all required fields (ID, Name, Category, and Fest Day)");
      return false;
    }

    // Check if ID already exists
    if (techelonsData.events.some(event => event.id === newEvent.id)) {
      toast.error("An event with this ID already exists");
      return false;
    }

    return true;
  };

  // Handle add event with validation
  const handleAddEvent = () => {
    if (validateEvent()) {
      addEvent();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">Add New Event</CardTitle>
        <CardDescription className="text-sm">
          Create a new event for Techelons
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <Accordion type="multiple" defaultValue={["basic-info"]} className="w-full">
          {/* Basic Information */}
          <AccordionItem value="basic-info">
            <AccordionTrigger className="text-base font-medium">Basic Information</AccordionTrigger>
            <AccordionContent>
              <EventFormSection 
                type="basic-info"
                event={newEvent}
                onChange={handleNewEventChange}
                techelonsData={techelonsData}
                resetImage={resetNewEventImage}
                isNewEvent={true}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Event Details */}
          <AccordionItem value="event-details">
            <AccordionTrigger className="text-base font-medium">Event Details</AccordionTrigger>
            <AccordionContent>
              <EventFormSection 
                type="event-details"
                event={newEvent}
                onChange={handleNewEventChange}
                techelonsData={techelonsData}
                isNewEvent={true}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Prizes & Coordinators */}
          <AccordionItem value="prizes-coordinators">
            <AccordionTrigger className="text-base font-medium">Prizes & Coordinators</AccordionTrigger>
            <AccordionContent>
              <EventFormSection 
                type="prizes-coordinators"
                event={newEvent}
                onChange={handleNewEventChange}
                techelonsData={techelonsData}
                isNewEvent={true}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Rules & Structure */}
          <AccordionItem value="rules-structure">
            <AccordionTrigger className="text-base font-medium">Rules & Structure</AccordionTrigger>
            <AccordionContent>
              <EventFormSection 
                type="rules-structure"
                event={newEvent}
                onChange={handleNewEventChange}
                techelonsData={techelonsData}
                isNewEvent={true}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Additional Information */}
          <AccordionItem value="additional-info">
            <AccordionTrigger className="text-base font-medium">Additional Information</AccordionTrigger>
            <AccordionContent>
              <EventFormSection 
                type="additional-info"
                event={newEvent}
                onChange={handleNewEventChange}
                techelonsData={techelonsData}
                isNewEvent={true}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="mt-6">
          <Button onClick={handleAddEvent} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 