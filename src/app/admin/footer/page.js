"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, PlusCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { ImageUpload } from "@/components/ui/image-upload";

const SOCIAL_ICONS = [
  { value: "FaInstagram", label: "Instagram" },
  { value: "FaLinkedinIn", label: "LinkedIn" },
  { value: "FaTwitter", label: "Twitter" },
  { value: "FaFacebookF", label: "Facebook" },
  { value: "FaYoutube", label: "YouTube" }
];

const DEFAULT_SOCIAL_LINK = {
  id: "",
  url: "",
  icon: "FaInstagram",
  hoverClass: "hover:text-pink-500"
};

export default function FooterManagement() {
  const [footer, setFooter] = useState({
    email: "",
    socialLinks: [],
    logoImage: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newSocialLink, setNewSocialLink] = useState(DEFAULT_SOCIAL_LINK);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const response = await fetch('/api/content');

      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }

      const data = await response.json();
      if (data.footer) {
        setFooter(data.footer);
      }
    } catch (error) {
      console.error('Error fetching footer:', error);
      toast.error('Failed to load footer content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFooter(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setNewSocialLink(prev => ({ ...prev, [name]: value }));
  };

  const handleExistingSocialLinkChange = (index, field, value) => {
    const updatedLinks = [...footer.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setFooter(prev => ({ ...prev, socialLinks: updatedLinks }));
  };

  const addSocialLink = () => {
    if (!newSocialLink.id || !newSocialLink.url) {
      toast.error('Please provide both ID and URL for the social link');
      return;
    }

    setFooter(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { ...newSocialLink }]
    }));

    setNewSocialLink(DEFAULT_SOCIAL_LINK);
  };

  const removeSocialLink = (index) => {
    const updatedLinks = [...footer.socialLinks];
    updatedLinks.splice(index, 1);
    setFooter(prev => ({ ...prev, socialLinks: updatedLinks }));
  };

  const handleLogoUpload = (url) => {
    setFooter(prev => ({ ...prev, logoImage: url }));
  };

  const saveFooter = async () => {
    try {
      setIsSaving(true);
      const response = await fetch('/api/content');

      if (!response.ok) {
        throw new Error('Failed to fetch current content');
      }

      const currentContent = await response.json();
      const updatedContent = { ...currentContent, footer };

      const saveResponse = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save footer content');
      }

      toast.success('Footer content saved successfully');
    } catch (error) {
      console.error('Error saving footer content:', error);
      toast.error('Failed to save footer content');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-base">Loading footer content...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Footer Content Management</h1>

      <div className="grid gap-6">
        {/* Email Section */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                value={footer.email || ""}
                onChange={handleInputChange}
                placeholder="e.g., websters@shivaji.du.ac.in"
              />
            </div>
          </CardContent>
        </Card>

        {/* Logo Image Section */}
        <Card>
          <CardHeader>
            <CardTitle>Footer Logo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {footer.logoImage && (
                <div className="space-y-2">
                  <Label>Current Logo</Label>
                  <div className="relative h-20 w-auto border rounded-md overflow-hidden">
                    <Image
                      src={footer.logoImage}
                      alt="Footer Logo"
                      width={250}
                      height={65}
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Upload Logo</Label>
                <ImageUpload
                  value={footer.logoImage}
                  onChange={handleLogoUpload}
                  onRemove={() => handleLogoUpload("")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links Section */}
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Existing Social Links */}
              {footer.socialLinks?.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium">Current Social Links</h3>
                  <div className="grid gap-4">
                    {footer.socialLinks.map((link, index) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-md">
                        <div className="space-y-2">
                          <Label htmlFor={`link-id-${index}`}>ID</Label>
                          <Input
                            id={`link-id-${index}`}
                            value={link.id}
                            onChange={(e) => handleExistingSocialLinkChange(index, 'id', e.target.value)}
                            placeholder="e.g., instagram"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`link-url-${index}`}>URL</Label>
                          <Input
                            id={`link-url-${index}`}
                            value={link.url}
                            onChange={(e) => handleExistingSocialLinkChange(index, 'url', e.target.value)}
                            placeholder="e.g., https://instagram.com/..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`link-icon-${index}`}>Icon</Label>
                          <select
                            id={`link-icon-${index}`}
                            value={link.icon}
                            onChange={(e) => handleExistingSocialLinkChange(index, 'icon', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            {SOCIAL_ICONS.map(icon => (
                              <option key={icon.value} value={icon.value}>{icon.label}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-end">
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => removeSocialLink(index)}
                            className="h-10 w-10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Add New Social Link */}
              <div className="space-y-4">
                <h3 className="font-medium">Add New Social Link</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-link-id">ID</Label>
                    <Input
                      id="new-link-id"
                      name="id"
                      value={newSocialLink.id}
                      onChange={handleSocialLinkChange}
                      placeholder="e.g., instagram"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-link-url">URL</Label>
                    <Input
                      id="new-link-url"
                      name="url"
                      value={newSocialLink.url}
                      onChange={handleSocialLinkChange}
                      placeholder="e.g., https://instagram.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-link-icon">Icon</Label>
                    <select
                      id="new-link-icon"
                      name="icon"
                      value={newSocialLink.icon}
                      onChange={handleSocialLinkChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {SOCIAL_ICONS.map(icon => (
                        <option key={icon.value} value={icon.value}>{icon.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={addSocialLink}
                      className="w-full"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={saveFooter}
          disabled={isSaving}
          className="w-full sm:w-auto ml-auto"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Footer Content
            </>
          )}
        </Button>
      </div>
    </div>
  );
}