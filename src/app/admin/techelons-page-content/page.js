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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { DEFAULT_CONTENT } from "@/app/data/techelonsData";

// Default content structure is now imported from /data/techelonsData.js

export default function TechelonsContentManagement() {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [newFeature, setNewFeature] = useState({
    title: "",
    icon: "🏆",
    description: ""
  });

  // Load content on component mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        
        // Set the DEFAULT_CONTENT from the import as the initial data
        setContent(DEFAULT_CONTENT);
        
        // Then try to fetch from API to see if there are any updates
        const response = await fetch('/api/techelons');

        if (response.ok) {
          const data = await response.json();
          // Only update if API returned uiContent
          if (data.uiContent) {
            setContent(data.uiContent);
          }
        }
      } catch (error) {
        console.error('Error fetching Techelons content:', error);
        toast.error('Failed to load Techelons content from API, using default content');
        // We already set DEFAULT_CONTENT above, so no need to set it again here
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Handle input changes for simple fields
  const handleInputChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle about paragraph changes
  const handleParagraphChange = (index, value) => {
    setContent(prev => {
      const newParagraphs = [...prev.aboutParagraphs];
      newParagraphs[index] = value;
      return { ...prev, aboutParagraphs: newParagraphs };
    });
  };

  // Handle feature changes
  const handleFeatureChange = (index, field, value) => {
    setContent(prev => {
      const newFeatures = [...prev.features];
      newFeatures[index] = { ...newFeatures[index], [field]: value };
      return { ...prev, features: newFeatures };
    });
  };

  // Handle new feature changes
  const handleNewFeatureChange = (field, value) => {
    setNewFeature(prev => ({ ...prev, [field]: value }));
  };

  // Content manipulation functions
  const contentManipulation = {
    // About paragraphs
    addParagraph: () => {
      setContent(prev => ({
        ...prev,
        aboutParagraphs: [...prev.aboutParagraphs, "New paragraph content goes here."]
      }));
      toast.success("New paragraph added successfully!");
    },

    removeParagraph: (index) => {
      setContent(prev => {
        const newParagraphs = [...prev.aboutParagraphs];
        newParagraphs.splice(index, 1);
        return { ...prev, aboutParagraphs: newParagraphs };
      });
      toast.success("Paragraph removed successfully!");
    },

    moveParagraphUp: (index) => {
      if (index === 0) return;
      setContent(prev => {
        const newParagraphs = [...prev.aboutParagraphs];
        [newParagraphs[index - 1], newParagraphs[index]] = [newParagraphs[index], newParagraphs[index - 1]];
        return { ...prev, aboutParagraphs: newParagraphs };
      });
      toast.success("Paragraph moved up");
    },

    moveParagraphDown: (index) => {
      setContent(prev => {
        const newParagraphs = [...prev.aboutParagraphs];
        if (index === newParagraphs.length - 1) return prev;
        [newParagraphs[index], newParagraphs[index + 1]] = [newParagraphs[index + 1], newParagraphs[index]];
        return { ...prev, aboutParagraphs: newParagraphs };
      });
      toast.success("Paragraph moved down");
    },

    // Features
    addFeature: () => {
      if (!newFeature.title.trim()) {
        toast.error("Please enter a title for the new feature");
        return;
      }
      if (!newFeature.description.trim()) {
        toast.error("Please enter a description for the new feature");
        return;
      }
      setContent(prev => ({
        ...prev,
        features: [...prev.features, { ...newFeature }]
      }));
      setNewFeature({ title: "", icon: "🏆", description: "" });
      toast.success("New feature added successfully!");
    },

    removeFeature: (index) => {
      setContent(prev => {
        const newFeatures = [...prev.features];
        newFeatures.splice(index, 1);
        return { ...prev, features: newFeatures };
      });
      toast.success("Feature removed successfully!");
    },

    moveFeatureUp: (index) => {
      if (index === 0) return;
      setContent(prev => {
        const newFeatures = [...prev.features];
        [newFeatures[index - 1], newFeatures[index]] = [newFeatures[index], newFeatures[index - 1]];
        return { ...prev, features: newFeatures };
      });
      toast.success("Feature moved up");
    },

    moveFeatureDown: (index) => {
      setContent(prev => {
        const newFeatures = [...prev.features];
        if (index === newFeatures.length - 1) return prev;
        [newFeatures[index], newFeatures[index + 1]] = [newFeatures[index + 1], newFeatures[index]];
        return { ...prev, features: newFeatures };
      });
      toast.success("Feature moved down");
    }
  };

  // Save all changes
  const saveContent = async () => {
    try {
      setIsSaving(true);
      
      // First try to get the current data from API
      let currentData = {};
      try {
        const response = await fetch('/api/techelons');
        if (response.ok) {
          currentData = await response.json();
        }
      } catch (error) {
        console.error('Error fetching current Techelons data:', error);
        // Continue with empty currentData if fetch fails
      }
      
      // Prepare the updated data with current content
      const updatedData = { ...currentData, uiContent: content };

      // Try to save to API
      try {
        const saveResponse = await fetch('/api/techelons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });

        if (!saveResponse.ok) {
          throw new Error('Failed to save Techelons content to API');
        }
        
        toast.success('Techelons content saved successfully to database');
      } catch (saveError) {
        console.error('Error saving to API:', saveError);
        toast.error('Failed to save to database, but changes are kept locally');
        // Changes are still in state, just not saved to the database
      }
    } catch (error) {
      console.error('Error in save process:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-base">Loading content...</span>
      </div>
    );
  }

  // Render UI components for paragraphs
  const renderParagraphControls = (index, total) => (
    <div className="flex space-x-1 w-full sm:w-auto justify-end">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => contentManipulation.moveParagraphUp(index)}
        disabled={index === 0}
        className="h-8 w-8"
        aria-label="Move paragraph up"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => contentManipulation.moveParagraphDown(index)}
        disabled={index === total - 1}
        className="h-8 w-8"
        aria-label="Move paragraph down"
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive h-8 w-8"
            aria-label="Remove paragraph"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the paragraph.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-white"
              onClick={() => contentManipulation.removeParagraph(index)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  // Render UI components for features
  const renderFeatureControls = (index, total) => (
    <div className="flex space-x-1 w-full sm:w-auto justify-end">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => contentManipulation.moveFeatureUp(index)}
        disabled={index === 0}
        className="h-8 w-8"
        aria-label="Move feature up"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => contentManipulation.moveFeatureDown(index)}
        disabled={index === total - 1}
        className="h-8 w-8"
        aria-label="Move feature down"
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive h-8 w-8"
            aria-label="Remove feature"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this feature.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-white"
              onClick={() => contentManipulation.removeFeature(index)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-center w-full sm:text-left sm:w-auto">Techelons Content Management</h1>
        <Button
          onClick={saveContent}
          disabled={isSaving}
          className="flex items-center w-full sm:w-auto"
        >
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4 w-full">
          <TabsTrigger value="general" className="text-xs sm:text-sm">General Information</TabsTrigger>
          <TabsTrigger value="about" className="text-xs sm:text-sm">About Section</TabsTrigger>
          <TabsTrigger value="features" className="text-xs sm:text-sm">Features</TabsTrigger>
        </TabsList>

        {/* General Information Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Update the main information displayed on the Techelons page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={content.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter the main title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  value={content.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  placeholder="Enter the subtitle"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="festDate">Fest Date</Label>
                <Input
                  id="festDate"
                  value={content.festDate}
                  onChange={(e) => handleInputChange('festDate', e.target.value)}
                  placeholder="Enter the fest date (e.g., April 2025)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exploreTitle">Explore Section Title</Label>
                <Input
                  id="exploreTitle"
                  value={content.exploreTitle}
                  onChange={(e) => handleInputChange('exploreTitle', e.target.value)}
                  placeholder="Enter the explore section title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exploreDescription">Explore Section Description</Label>
                <Textarea
                  id="exploreDescription"
                  value={content.exploreDescription}
                  onChange={(e) => handleInputChange('exploreDescription', e.target.value)}
                  placeholder="Enter the explore section description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Section Tab */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
              <CardDescription>
                Update the about section content for Techelons.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aboutTitle">About Section Title</Label>
                <Input
                  id="aboutTitle"
                  value={content.aboutTitle}
                  onChange={(e) => handleInputChange('aboutTitle', e.target.value)}
                  placeholder="Enter the about section title"
                />
              </div>

              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                  <Label>About Paragraphs</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={contentManipulation.addParagraph}
                    className="flex items-center w-full sm:w-auto"
                  >
                    <PlusCircle className="mr-1 h-4 w-4" />
                    Add Paragraph
                  </Button>
                </div>

                <div className="rounded-md border p-3">
                  {content.aboutParagraphs.map((paragraph, index) => (
                    <div key={index} className="mb-4 pb-4 border-b last:border-0">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                        <Label htmlFor={`paragraph-${index}`} className="mb-1 sm:mb-0">
                          Paragraph {index + 1}
                        </Label>
                        {renderParagraphControls(index, content.aboutParagraphs.length)}
                      </div>
                      <Textarea
                        id={`paragraph-${index}`}
                        value={paragraph}
                        onChange={(e) => handleParagraphChange(index, e.target.value)}
                        placeholder="Enter paragraph content"
                        rows={4}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>
                Manage the features displayed on the Techelons page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Features */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <Label>Current Features</Label>
                </div>

                <div className="rounded-md border p-3">
                  {content.features.map((feature, index) => (
                    <div key={index} className="mb-4 pb-4 border-b last:border-0">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                        <Label className="mb-1 sm:mb-0">Feature {index + 1}</Label>
                        {renderFeatureControls(index, content.features.length)}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor={`feature-title-${index}`}>Title</Label>
                          <Input
                            id={`feature-title-${index}`}
                            value={feature.title}
                            onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                            placeholder="Feature title"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`feature-icon-${index}`}>Icon (Emoji)</Label>
                          <Input
                            id={`feature-icon-${index}`}
                            value={feature.icon}
                            onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                            placeholder="Feature icon (emoji)"
                          />
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor={`feature-description-${index}`}>Description</Label>
                          <Textarea
                            id={`feature-description-${index}`}
                            value={feature.description}
                            onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                            placeholder="Feature description"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Add New Feature */}
              <div className="space-y-4">
                <Label>Add New Feature</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="new-feature-title">Title</Label>
                    <Input
                      id="new-feature-title"
                      value={newFeature.title}
                      onChange={(e) => handleNewFeatureChange('title', e.target.value)}
                      placeholder="Feature title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-feature-icon">Icon (Emoji)</Label>
                    <Input
                      id="new-feature-icon"
                      value={newFeature.icon}
                      onChange={(e) => handleNewFeatureChange('icon', e.target.value)}
                      placeholder="Feature icon (emoji)"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="new-feature-description">Description</Label>
                    <Textarea
                      id="new-feature-description"
                      value={newFeature.description}
                      onChange={(e) => handleNewFeatureChange('description', e.target.value)}
                      placeholder="Feature description"
                      rows={2}
                    />
                  </div>
                </div>

                <Button
                  onClick={contentManipulation.addFeature}
                  className="flex items-center w-full sm:w-auto mt-2"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Feature
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}