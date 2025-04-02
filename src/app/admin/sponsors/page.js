"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, RefreshCw, Trash2, Plus, ExternalLink, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { fetchSponsorsData } from "@/lib/utils";
import sponsorsDataFallback from "@/app/data/sponsorsData";
import Image from "next/image";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const DEFAULT_NEW_SPONSOR = {
  id: "",
  name: "",
  img: "/assets/webstersLogo.png",
  website: "",
  category: "general",
  priority: 0
};

export default function SponsorsManagement() {
  const [sponsorsData, setSponsorsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sponsorToDelete, setSponsorToDelete] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUsingFallbackData, setIsUsingFallbackData] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newSponsor, setNewSponsor] = useState({ ...DEFAULT_NEW_SPONSOR });

  // Load Sponsors data on component mount
  useEffect(() => {
    const loadSponsorsData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSponsorsData();

        if (data) {
          // Ensure showSection exists in uiContent with a default value
          if (!data.uiContent.hasOwnProperty('showSection')) {
            data.uiContent.showSection = true;
          }
          setSponsorsData(data);
          setIsUsingFallbackData(false);
        } else {
          throw new Error('Failed to fetch Sponsors data');
        }
      } catch (error) {
        console.error('Error fetching Sponsors data:', error);
        toast.error('Failed to load Sponsors data');

        // Initialize with fallback structure
        const fallbackData = { ...sponsorsDataFallback };
        if (!fallbackData.uiContent.hasOwnProperty('showSection')) {
          fallbackData.uiContent.showSection = true;
        }
        setSponsorsData(fallbackData);
        setIsUsingFallbackData(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadSponsorsData();
  }, []);

  // Track unsaved changes
  useEffect(() => {
    if (!isLoading && sponsorsData) {
      setHasUnsavedChanges(true);
    }
  }, [sponsorsData, isLoading]);

  const handleUIContentChange = useCallback((field, value) => {
    setSponsorsData(prev => ({
      ...prev,
      uiContent: {
        ...prev.uiContent,
        [field]: value
      }
    }));
  }, []);

  const handleNewSponsorChange = useCallback((field, value) => {
    setNewSponsor(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSponsorChange = useCallback((index, field, value) => {
    setSponsorsData(prev => {
      const updatedSponsors = [...prev.sponsors];
      updatedSponsors[index] = {
        ...updatedSponsors[index],
        [field]: value
      };
      return {
        ...prev,
        sponsors: updatedSponsors
      };
    });
  }, []);

  const addSponsor = useCallback(() => {
    if (!newSponsor.name.trim()) {
      toast.error('Sponsor name is required');
      return;
    }

    // Generate a unique ID
    const sponsorId = `sponsor-${new Date().getTime()}`;

    setSponsorsData(prev => ({
      ...prev,
      sponsors: [...prev.sponsors, { ...newSponsor, id: sponsorId }]
    }));

    // Reset form
    setNewSponsor({ ...DEFAULT_NEW_SPONSOR });
    toast.success('New sponsor added');
    setActiveTab('sponsors');
  }, [newSponsor]);

  const handleFileUpload = useCallback(async (event, index = null) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('section', 'sponsors');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload image');
      }

      const data = await response.json();

      if (index !== null) {
        // Existing sponsor
        handleSponsorChange(index, 'img', data.url);
      } else {
        // New sponsor
        handleNewSponsorChange('img', data.url);
      }

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  }, [handleSponsorChange, handleNewSponsorChange]);

  const openDeleteDialog = useCallback((index) => {
    setSponsorToDelete(index);
    setDeleteDialogOpen(true);
  }, []);

  const confirmRemoveSponsor = useCallback(() => {
    setSponsorsData(prev => {
      const updatedSponsors = [...prev.sponsors];
      updatedSponsors.splice(sponsorToDelete, 1);
      return {
        ...prev,
        sponsors: updatedSponsors
      };
    });

    setDeleteDialogOpen(false);
    toast.success('Sponsor removed');
  }, [sponsorToDelete]);

  const saveSponsorsData = useCallback(async () => {
    if (!hasUnsavedChanges) return;

    try {
      setIsSaving(true);

      const response = await fetch('/api/sponsors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sponsorsData),
      });

      if (!response.ok) {
        throw new Error('Failed to save sponsors data');
      }

      setHasUnsavedChanges(false);
      toast.success('Sponsors data saved successfully');
    } catch (error) {
      console.error('Error saving sponsors data:', error);
      toast.error('Failed to save sponsors data');
    } finally {
      setIsSaving(false);
    }
  }, [sponsorsData, hasUnsavedChanges]);

  const refreshPage = useCallback(() => {
    window.location.reload();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading sponsors data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Sponsors Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage sponsors and their information
          </p>
          {isUsingFallbackData && (
            <p className="text-xs text-amber-500 mt-1">
              Using fallback data. Changes will create a new database entry.
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshPage}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="hidden xs:inline">Refresh</span>
          </Button>
          <Button
            onClick={saveSponsorsData}
            disabled={isSaving || !hasUnsavedChanges}
            size="sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
          <TabsTrigger value="add">Add Sponsor</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="p-4 bg-white rounded-md shadow-sm mt-4">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">UI Content</h2>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-section" className="cursor-pointer">Show Sponsors Section</Label>
                <Switch
                  id="show-section"
                  checked={sponsorsData.uiContent.showSection}
                  onCheckedChange={(checked) => handleUIContentChange('showSection', checked)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {sponsorsData.uiContent.showSection
                  ? "Sponsors section is currently visible on the website."
                  : "Sponsors section is currently hidden from the website."}
              </p>

              <Separator />

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  className="mt-1"
                  value={sponsorsData.uiContent.title}
                  onChange={(e) => handleUIContentChange('title', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  className="mt-1"
                  value={sponsorsData.uiContent.subtitle}
                  onChange={(e) => handleUIContentChange('subtitle', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  className="mt-1"
                  value={sponsorsData.uiContent.description}
                  onChange={(e) => handleUIContentChange('description', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Sponsors List Tab */}
        <TabsContent value="sponsors" className="mt-4">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Current Sponsors</h2>

            {sponsorsData.sponsors.length === 0 ? (
              <div className="p-8 text-center border rounded-md bg-gray-50">
                <p className="text-muted-foreground">No sponsors added yet. Add your first sponsor from the "Add Sponsor" tab.</p>
                <Button
                  onClick={() => setActiveTab('add')}
                  variant="outline"
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sponsor
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sponsorsData.sponsors.map((sponsor, index) => (
                  <Card key={sponsor.id}>
                    <div className="h-32 flex items-center justify-center overflow-hidden">
                      <Image
                        src={sponsor.img}
                        alt={sponsor.name}
                        width={200}
                        height={100}
                        className="object-contain p-4 max-h-28"
                        unoptimized={true}
                      />
                    </div>
                    <CardHeader className="p-4 pb-0">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{sponsor.name}</CardTitle>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openDeleteDialog(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <CardDescription className="flex items-center text-xs">
                        <span className="capitalize">{sponsorsData.categories[sponsor.category]}</span>
                        <span className="mx-1">•</span>
                        <span>Priority: {sponsor.priority}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`sponsor-${index}-name`} className="text-xs">Name</Label>
                          <Input
                            id={`sponsor-${index}-name`}
                            value={sponsor.name}
                            onChange={(e) => handleSponsorChange(index, 'name', e.target.value)}
                            className="h-8 text-sm mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`sponsor-${index}-website`} className="text-xs">Website</Label>
                          <div className="flex mt-1">
                            <Input
                              id={`sponsor-${index}-website`}
                              value={sponsor.website || ''}
                              onChange={(e) => handleSponsorChange(index, 'website', e.target.value)}
                              placeholder="https://..."
                              className="h-8 text-sm"
                            />
                            {sponsor.website && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-1 h-8 w-8"
                                onClick={() => window.open(sponsor.website, '_blank')}
                                aria-label="Visit website"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor={`sponsor-${index}-category`} className="text-xs">Category</Label>
                            <Select
                              value={sponsor.category}
                              onValueChange={(value) => handleSponsorChange(index, 'category', value)}
                            >
                              <SelectTrigger className="h-8 text-xs mt-1" id={`sponsor-${index}-category`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(sponsorsData.categories).map(([key, value]) => (
                                  <SelectItem key={key} value={key} className="text-xs">
                                    {value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground mt-1">Groups sponsors by type</p>
                          </div>

                          <div>
                            <Label htmlFor={`sponsor-${index}-priority`} className="text-xs">Priority</Label>
                            <Input
                              id={`sponsor-${index}-priority`}
                              type="number"
                              min="0"
                              value={sponsor.priority}
                              onChange={(e) => handleSponsorChange(index, 'priority', parseInt(e.target.value) || 0)}
                              className="h-8 text-sm mt-1"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Higher = displayed first</p>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor={`sponsor-${index}-img-upload`} className="text-xs">Image</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="relative">
                              <Input
                                type="file"
                                id={`sponsor-${index}-img-upload`}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, index)}
                                disabled={isUploading}
                              />
                              <Button type="button" variant="outline" size="sm" disabled={isUploading}>
                                {isUploading ? (
                                  <>
                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="h-3 w-3 mr-1" />
                                    Upload
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Add Sponsor Tab */}
        <TabsContent value="add" className="p-4 bg-white rounded-md shadow-sm mt-4">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Add New Sponsor</h2>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="new-sponsor-name">Sponsor Name *</Label>
                <Input
                  id="new-sponsor-name"
                  value={newSponsor.name}
                  onChange={(e) => handleNewSponsorChange('name', e.target.value)}
                  placeholder="Enter sponsor name"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="new-sponsor-website">Website URL</Label>
                <Input
                  id="new-sponsor-website"
                  value={newSponsor.website}
                  onChange={(e) => handleNewSponsorChange('website', e.target.value)}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-sponsor-category">Category</Label>
                  <Select
                    value={newSponsor.category}
                    onValueChange={(value) => handleNewSponsorChange('category', value)}
                  >
                    <SelectTrigger id="new-sponsor-category" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(sponsorsData.categories).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">Groups sponsors by type or level</p>
                </div>

                <div>
                  <Label htmlFor="new-sponsor-priority">Priority</Label>
                  <Input
                    id="new-sponsor-priority"
                    type="number"
                    min="0"
                    value={newSponsor.priority}
                    onChange={(e) => handleNewSponsorChange('priority', parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Higher = displayed first</p>
                </div>
              </div>

              <div>
                <Label htmlFor="new-sponsor-img-upload">Sponsor Image</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="relative">
                    <Input
                      type="file"
                      id="new-sponsor-img-upload"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, null)}
                      disabled={isUploading}
                    />
                    <Button type="button" variant="outline" disabled={isUploading}>
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="mt-2 p-4 border rounded-md flex items-center justify-center bg-gray-50">
                  <Image
                    src={newSponsor.img}
                    alt="Preview"
                    width={200}
                    height={100}
                    className="object-contain max-h-24"
                    unoptimized={true}
                  />
                </div>
              </div>

              <Button
                onClick={addSponsor}
                disabled={!newSponsor.name.trim()}
                className="w-full mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Sponsor
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the sponsor. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveSponsor}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}