"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, PlusCircle, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { ImageUpload } from "@/components/ui/image-upload";
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

export default function ContentManagement() {
    const [content, setContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Alert Dialog states
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    const [alertDialogAction, setAlertDialogAction] = useState(null);
    const [alertDialogTitle, setAlertDialogTitle] = useState("");
    const [alertDialogDescription, setAlertDialogDescription] = useState("");

    // Form states
    const [newMember, setNewMember] = useState({
        name: "",
        role: "",
        image: "",
        linkedin: ""
    });

    const [newEvent, setNewEvent] = useState({
        title: "",
        imageUrl: ""
    });

    // Load content on component mount
    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const response = await fetch('/api/content');

            if (!response.ok) {
                throw new Error('Failed to fetch content');
            }

            const data = await response.json();
            setContent(data);
        } catch (error) {
            console.error('Error fetching content:', error);
            toast.error('Failed to load content');

            // Initialize with empty structure if fetch fails
            setContent({
                banner: { title: "", subtitle: "", logoImage: "" },
                about: { title: "", paragraphs: [] },
                council: { title: "", description: "", members: [] },
                pastEvents: { title: "", description: "", events: [] }
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Generic handlers
    const handleInputChange = (section, field, value) => {
        setContent(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    // About section handlers
    const handleParagraphChange = (index, value) => {
        setContent(prev => {
            const newParagraphs = [...prev.about.paragraphs];
            newParagraphs[index] = { ...newParagraphs[index], content: value };
            return {
                ...prev,
                about: {
                    ...prev.about,
                    paragraphs: newParagraphs,
                },
            };
        });
    };

    const addParagraph = () => {
        setContent(prev => {
            const highestId = Math.max(0, ...prev.about.paragraphs.map(p => p.id));
            return {
                ...prev,
                about: {
                    ...prev.about,
                    paragraphs: [
                        ...prev.about.paragraphs,
                        { id: highestId + 1, content: "New paragraph content goes here." }
                    ],
                },
            };
        });
        toast.success("New paragraph added");
    };

    const removeParagraph = (index) => {
        showConfirmDialog(
            "Remove Paragraph",
            "Are you sure you want to remove this paragraph? This action cannot be undone.",
            () => {
                setContent(prev => {
                    const newParagraphs = [...prev.about.paragraphs];
                    newParagraphs.splice(index, 1);
                    return {
                        ...prev,
                        about: {
                            ...prev.about,
                            paragraphs: newParagraphs,
                        },
                    };
                });
                toast.success("Paragraph removed");
            }
        );
    };

    const moveParagraph = (index, direction) => {
        setContent(prev => {
            const newParagraphs = [...prev.about.paragraphs];

            // Don't move if at boundaries
            if (
                (direction === 'up' && index === 0) ||
                (direction === 'down' && index === newParagraphs.length - 1)
            ) {
                return prev;
            }

            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            [newParagraphs[index], newParagraphs[targetIndex]] =
                [newParagraphs[targetIndex], newParagraphs[index]];

            return {
                ...prev,
                about: {
                    ...prev.about,
                    paragraphs: newParagraphs,
                },
            };
        });
        toast.success(`Paragraph moved ${direction}`);
    };

    // Council section handlers
    const handleFormChange = (setter, field, value) => {
        setter(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleArrayItemChange = (section, itemsField, index, field, value) => {
        setContent(prev => {
            const items = [...prev[section][itemsField]];
            items[index] = { ...items[index], [field]: value };
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    [itemsField]: items,
                },
            };
        });
    };

    const addCouncilMember = () => {
        if (!newMember.name.trim() || !newMember.role.trim()) {
            toast.error("Please enter a name and role for the new member");
            return;
        }

        setContent(prev => ({
            ...prev,
            council: {
                ...prev.council,
                members: [...prev.council.members, { ...newMember }],
            },
        }));

        setNewMember({ name: "", role: "", image: "", linkedin: "" });
        toast.success("New council member added");
    };

    const removeCouncilMember = (index) => {
        showConfirmDialog(
            "Remove Council Member",
            "Are you sure you want to remove this council member? This action cannot be undone.",
            () => {
                setContent(prev => {
                    const newMembers = [...prev.council.members];
                    newMembers.splice(index, 1);
                    return {
                        ...prev,
                        council: {
                            ...prev.council,
                            members: newMembers,
                        },
                    };
                });
                toast.success("Council member removed");
            }
        );
    };

    // Events section handlers
    const addEvent = () => {
        if (!newEvent.title.trim()) {
            toast.error("Please enter a title for the new event");
            return;
        }

        setContent(prev => ({
            ...prev,
            pastEvents: {
                ...prev.pastEvents,
                events: [...(prev.pastEvents.events || []), { ...newEvent }],
            },
        }));

        setNewEvent({ title: "", imageUrl: "" });
        toast.success("New event added");
    };

    const removeEvent = (index) => {
        showConfirmDialog(
            "Remove Event",
            "Are you sure you want to remove this event? This action cannot be undone.",
            () => {
                setContent(prev => {
                    const newEvents = [...prev.pastEvents.events];
                    newEvents.splice(index, 1);
                    return {
                        ...prev,
                        pastEvents: {
                            ...prev.pastEvents,
                            events: newEvents,
                        },
                    };
                });
                toast.success("Event removed");
            }
        );
    };

    // Dialog helper
    const showConfirmDialog = (title, description, onConfirm) => {
        setAlertDialogTitle(title);
        setAlertDialogDescription(description);
        setAlertDialogAction(() => onConfirm);
        setAlertDialogOpen(true);
    };

    // Image handlers
    const resetImage = (setter, field) => {
        setter(prev => ({
            ...prev,
            [field]: ""
        }));
        toast.success("Image removed");
    };

    // Save content to API
    const saveContent = async () => {
        try {
            setIsSaving(true);
            const response = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content),
            });

            if (!response.ok) throw new Error('Failed to save content');
            toast.success('Content saved successfully');
        } catch (error) {
            console.error('Error saving content:', error);
            toast.error('Failed to save content');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Alert Dialog */}
            <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertDialogTitle}</AlertDialogTitle>
                        <AlertDialogDescription>{alertDialogDescription}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => alertDialogAction?.()}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Content Management</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Manage your website's content and settings
                    </p>
                </div>
                <Button onClick={saveContent} disabled={isSaving} className="w-full sm:w-auto">
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>

            <Separator />

            {/* Content Tabs */}
            <Tabs defaultValue="banner" className="space-y-4">
                <div className="overflow-x-auto pb-2">
                    <TabsList className="grid grid-cols-4 w-full max-w-md">
                        <TabsTrigger value="banner">Banner</TabsTrigger>
                        <TabsTrigger value="about">About</TabsTrigger>
                        <TabsTrigger value="council">Council</TabsTrigger>
                        <TabsTrigger value="events">Events</TabsTrigger>
                    </TabsList>
                </div>

                {/* Banner Tab */}
                <TabsContent value="banner" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Banner Section</CardTitle>
                            <CardDescription>
                                Update the main banner content and images
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="bannerTitle">Banner Title</Label>
                                <Input
                                    id="bannerTitle"
                                    value={content.banner.title}
                                    onChange={(e) => handleInputChange("banner", "title", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bannerSubtitle">Banner Subtitle</Label>
                                <Input
                                    id="bannerSubtitle"
                                    value={content.banner.subtitle}
                                    onChange={(e) => handleInputChange("banner", "subtitle", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Banner Image</Label>
                                <ImageUpload
                                    value={content.banner.logoImage}
                                    onChange={(url) => handleInputChange("banner", "logoImage", url)}
                                    onRemove={() => handleInputChange("banner", "logoImage", "")}
                                    previewWidth={300}
                                    aspectRatio="3:4"
                                    description="Upload a banner image (3:4 aspect ratio recommended)"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* About Tab */}
                <TabsContent value="about" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>About Section</CardTitle>
                            <CardDescription>
                                Manage the about section content
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="aboutTitle">About Title</Label>
                                <Input
                                    id="aboutTitle"
                                    value={content.about.title}
                                    onChange={(e) => handleInputChange("about", "title", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>About Paragraphs</Label>
                                <div className="space-y-4 rounded-md border p-2 sm:p-4">
                                    {content.about.paragraphs.map((paragraph, index) => (
                                        <div key={paragraph.id} className="space-y-2 p-2 border rounded-md">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => moveParagraph(index, 'up')}
                                                        disabled={index === 0}
                                                        className="h-8 w-8"
                                                    >
                                                        <ArrowUp className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => moveParagraph(index, 'down')}
                                                        disabled={index === content.about.paragraphs.length - 1}
                                                        className="h-8 w-8"
                                                    >
                                                        <ArrowDown className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <span className="text-xs text-muted-foreground">Paragraph {index + 1}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeParagraph(index)}
                                                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <Textarea
                                                value={paragraph.content}
                                                onChange={(e) => handleParagraphChange(index, e.target.value)}
                                                className="min-h-[100px] resize-y"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={addParagraph}
                                    className="w-full"
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Paragraph
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Council Tab */}
                <TabsContent value="council" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Council Members</CardTitle>
                            <CardDescription>
                                Manage council member information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                {content.council.members.map((member, index) => (
                                    <Card key={index} className="overflow-hidden">
                                        <CardContent className="p-4">
                                            <div className="space-y-4">
                                                <div className="relative w-full rounded-lg" style={{ aspectRatio: "3/4" }}>
                                                    {member.image ? (
                                                        <Image
                                                            src={member.image}
                                                            alt={member.name}
                                                            fill
                                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-muted flex items-center justify-center">
                                                            <span className="text-muted-foreground">No image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Name</Label>
                                                    <Input
                                                        value={member.name}
                                                        onChange={(e) => handleArrayItemChange("council", "members", index, "name", e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Role</Label>
                                                    <Input
                                                        value={member.role}
                                                        onChange={(e) => handleArrayItemChange("council", "members", index, "role", e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>LinkedIn URL</Label>
                                                    <Input
                                                        value={member.linkedin || ""}
                                                        onChange={(e) => handleArrayItemChange("council", "members", index, "linkedin", e.target.value)}
                                                    />
                                                </div>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => removeCouncilMember(index)}
                                                    className="w-full"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Remove Member
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Add New Member</h3>
                                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input
                                            value={newMember.name}
                                            onChange={(e) => handleFormChange(setNewMember, "name", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Role</Label>
                                        <Input
                                            value={newMember.role}
                                            onChange={(e) => handleFormChange(setNewMember, "role", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>LinkedIn URL</Label>
                                        <Input
                                            value={newMember.linkedin || ""}
                                            onChange={(e) => handleFormChange(setNewMember, "linkedin", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Profile Image</Label>
                                        <ImageUpload
                                            value={newMember.image}
                                            onChange={(url) => handleFormChange(setNewMember, "image", url)}
                                            onRemove={() => resetImage(setNewMember, "image")}
                                            previewWidth={200}
                                            aspectRatio="3:4"
                                            description="Upload a profile image (3:4 aspect ratio recommended)"
                                        />
                                    </div>
                                </div>
                                <Button
                                    onClick={addCouncilMember}
                                    className="w-full"
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Member
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Events Tab */}
                <TabsContent value="events" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Past Events</CardTitle>
                            <CardDescription>
                                Manage past event information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                                {content.pastEvents.events.map((event, index) => (
                                    <Card key={index} className="overflow-hidden">
                                        <CardContent className="p-4">
                                            <div className="space-y-4">
                                                <div className="relative w-full rounded-lg" style={{ aspectRatio: "16/9" }}>
                                                    {event.imageUrl ? (
                                                        <Image
                                                            src={event.imageUrl}
                                                            alt={event.title}
                                                            fill
                                                            sizes="(max-width: 640px) 100vw, 50vw"
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-muted flex items-center justify-center">
                                                            <span className="text-muted-foreground">No image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Title</Label>
                                                    <Input
                                                        value={event.title}
                                                        onChange={(e) => handleArrayItemChange("pastEvents", "events", index, "title", e.target.value)}
                                                    />
                                                </div>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => removeEvent(index)}
                                                    className="w-full"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Remove Event
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Add New Event</h3>
                                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input
                                            value={newEvent.title}
                                            onChange={(e) => handleFormChange(setNewEvent, "title", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Event Image</Label>
                                        <ImageUpload
                                            value={newEvent.imageUrl}
                                            onChange={(url) => handleFormChange(setNewEvent, "imageUrl", url)}
                                            onRemove={() => resetImage(setNewEvent, "imageUrl")}
                                            previewWidth={300}
                                            aspectRatio="16:9"
                                            description="Upload an event image (16:9 aspect ratio recommended)"
                                        />
                                    </div>
                                </div>
                                <Button
                                    onClick={addEvent}
                                    className="w-full"
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Event
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}