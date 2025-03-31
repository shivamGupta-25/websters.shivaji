"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Plus, Trash2, ArrowUp, ArrowDown, AlertTriangle, Download } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { fetchSiteContent } from '@/lib/utils';
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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function WorkshopManagement() {
    const router = useRouter();
    const [workshop, setWorkshop] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState({
        saving: false,
        flushing: false,
        exporting: false
    });

    // Load workshop data on component mount
    useEffect(() => {
        async function loadWorkshopData() {
            try {
                const response = await fetch('/api/workshop');
                const data = response.ok
                    ? await response.json()
                    : JSON.parse(JSON.stringify((await fetchSiteContent()).workshop));

                setWorkshop(data);
            } catch (error) {
                console.error("Error fetching workshop data:", error);
                const fallbackData = JSON.parse(JSON.stringify((await fetchSiteContent()).workshop));
                setWorkshop(fallbackData);
            } finally {
                setIsLoading(false);
            }
        }

        loadWorkshopData();
    }, []);

    const updateWorkshop = (field, value) => {
        setWorkshop(prev => ({ ...prev, [field]: value }));
    };

    const updateDetail = (index, field, value) => {
        setWorkshop(prev => {
            const newDetails = [...prev.details];
            newDetails[index] = { ...newDetails[index], [field]: value };
            return { ...prev, details: newDetails };
        });
    };

    const addDetail = () => {
        setWorkshop(prev => ({
            ...prev,
            details: [
                ...prev.details,
                { id: `detail-${Date.now()}`, label: "", value: "" }
            ]
        }));
    };

    const removeDetail = (index) => {
        setWorkshop(prev => ({
            ...prev,
            details: prev.details.filter((_, i) => i !== index)
        }));
    };

    const moveDetail = (index, direction) => {
        setWorkshop(prev => {
            const newDetails = [...prev.details];
            const newIndex = direction === 'up' ? index - 1 : index + 1;

            if (newIndex >= 0 && newIndex < newDetails.length) {
                [newDetails[index], newDetails[newIndex]] = [newDetails[newIndex], newDetails[index]];
            }

            return { ...prev, details: newDetails };
        });
    };

    const saveWorkshop = async () => {
        try {
            setIsSubmitting(prev => ({ ...prev, saving: true }));
            const toastId = toast.loading('Saving workshop data...');

            const response = await fetch('/api/workshop', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(workshop),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save workshop data');
            }

            toast.dismiss(toastId);
            toast.success('Workshop data saved successfully!');
            router.refresh();
        } catch (error) {
            console.error("Error saving workshop data:", error);
            toast.error(error.message || "Failed to save workshop data");
        } finally {
            setIsSubmitting(prev => ({ ...prev, saving: false }));
        }
    };

    const flushWorkshopData = async () => {
        try {
            setIsSubmitting(prev => ({ ...prev, flushing: true }));
            const toastId = toast.loading('Flushing workshop registration data...');

            const response = await fetch('/api/workshop/flush-registrations', {
                method: 'DELETE',
            });

            toast.dismiss(toastId);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to flush registration data');
            }

            const result = await response.json();
            toast.success(`Workshop registration data flushed! ${result.deletedCount} registrations deleted.`);
        } catch (error) {
            console.error("Error flushing data:", error);
            toast.error(error.message || "Failed to flush registration data");
        } finally {
            setIsSubmitting(prev => ({ ...prev, flushing: false }));
        }
    };

    const exportWorkshopData = async () => {
        try {
            setIsSubmitting(prev => ({ ...prev, exporting: true }));
            const toastId = toast.loading('Preparing data for download...');

            const response = await fetch('/api/workshop/export-registrations');
            toast.dismiss(toastId);

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage;

                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.error;
                } catch {
                    errorMessage = `Export failed: ${response.statusText}`;
                }

                throw new Error(errorMessage || 'Failed to export data');
            }

            const csvText = await response.text();
            const hasData = csvText.trim().split('\n').length > 1;

            toast.success(hasData
                ? 'Workshop registration data downloaded successfully!'
                : 'CSV file downloaded. No registrations found.');

            // Handle download
            const blob = new Blob([csvText], { type: 'text/csv' });
            const filename = getFilenameFromHeader(response) || 'workshop-registrations.csv';
            downloadBlob(blob, filename);

        } catch (error) {
            console.error("Error exporting data:", error);
            toast.error(error.message || "Failed to export data");
        } finally {
            setIsSubmitting(prev => ({ ...prev, exporting: false }));
        }
    };

    function getFilenameFromHeader(response) {
        const contentDisposition = response.headers.get('Content-Disposition');
        if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+)"/);
            return match?.[1];
        }
        return null;
    }

    function downloadBlob(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Workshop Management</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage workshop details and registration settings
                    </p>
                </div>
                <Button
                    onClick={saveWorkshop}
                    disabled={isSubmitting.saving}
                    className="w-full sm:w-auto"
                >
                    {isSubmitting.saving ? (
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

            <div className="grid gap-6">
                {/* Basic Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Basic Information</CardTitle>
                        <CardDescription>
                            Update the workshop's basic details and registration status
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Workshop Title</Label>
                            <Input
                                id="title"
                                value={workshop.title}
                                onChange={(e) => updateWorkshop("title", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="shortDescription">Short Description</Label>
                            <Textarea
                                id="shortDescription"
                                value={workshop.shortDescription}
                                onChange={(e) => updateWorkshop("shortDescription", e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isRegistrationOpen"
                                checked={workshop.isRegistrationOpen}
                                onCheckedChange={(checked) => updateWorkshop("isRegistrationOpen", checked)}
                            />
                            <Label htmlFor="isRegistrationOpen">Registration Open</Label>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatsappGroupLink">WhatsApp Group Link</Label>
                            <Input
                                id="whatsappGroupLink"
                                value={workshop.whatsappGroupLink}
                                onChange={(e) => updateWorkshop("whatsappGroupLink", e.target.value)}
                                placeholder="https://chat.whatsapp.com/..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Banner Image Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Banner Image</CardTitle>
                        <CardDescription>
                            Upload or update the workshop's banner image
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ImageUpload
                            value={workshop.bannerImage}
                            onChange={(value) => updateWorkshop("bannerImage", value)}
                            onRemove={() => updateWorkshop("bannerImage", "")}
                            previewWidth={400}
                            aspectRatio="16:9"
                            description="Upload a banner image (16:9 aspect ratio recommended)"
                        />
                    </CardContent>
                </Card>

                {/* Workshop Details Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Workshop Details</CardTitle>
                        <CardDescription>
                            Add and manage workshop-specific details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            {workshop.details.map((detail, index) => (
                                <DetailItem
                                    key={detail.id}
                                    detail={detail}
                                    index={index}
                                    isFirst={index === 0}
                                    isLast={index === workshop.details.length - 1}
                                    onChange={updateDetail}
                                    onMove={moveDetail}
                                    onRemove={removeDetail}
                                />
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            onClick={addDetail}
                            className="w-full"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Detail
                        </Button>
                    </CardContent>
                </Card>

                {/* Danger Zone Card */}
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive flex items-center gap-2 text-xl">
                            <AlertTriangle className="h-5 w-5" />
                            Danger Zone
                        </CardTitle>
                        <CardDescription>
                            Actions that cannot be undone
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Workshop Registration Data</Label>
                            <p className="text-sm text-muted-foreground">
                                Download or flush all workshop registration data. Flushing data cannot be undone.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 mt-2">
                                <Button
                                    variant="outline"
                                    onClick={exportWorkshopData}
                                    disabled={isSubmitting.exporting}
                                    className="w-full sm:flex-1"
                                >
                                    {isSubmitting.exporting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Exporting...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="mr-2 h-4 w-4" />
                                            Download as CSV
                                        </>
                                    )}
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            disabled={isSubmitting.flushing}
                                            className="w-full sm:flex-1"
                                        >
                                            {isSubmitting.flushing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Flushing Data...
                                                </>
                                            ) : (
                                                "Flush Registration Data"
                                            )}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="max-w-md mx-auto">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete all
                                                workshop registration data from the database.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                            <AlertDialogCancel className="w-full sm:w-auto">
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={flushWorkshopData}
                                                className="bg-destructive text-white hover:bg-destructive/90 w-full sm:w-auto"
                                            >
                                                Yes, Flush All Data
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Detail Item Component to reduce complexity in main component
function DetailItem({ detail, index, isFirst, isLast, onChange, onMove, onRemove }) {
    return (
        <div className="space-y-2 border p-4 rounded-md">
            <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
                <div className="font-medium">Detail: {index + 1}</div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onMove(index, 'up')}
                        disabled={isFirst}
                        className="h-8 w-8"
                        aria-label="Move up"
                    >
                        <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onMove(index, 'down')}
                        disabled={isLast}
                        className="h-8 w-8"
                        aria-label="Move down"
                    >
                        <ArrowDown className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive h-8 w-8"
                                aria-label="Remove detail"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-md mx-auto">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will remove the detail from the workshop information.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                <AlertDialogCancel className="w-full sm:w-auto">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onRemove(index)}
                                    className="bg-destructive text-white hover:bg-destructive/90 w-full sm:w-auto"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                        value={detail.label}
                        onChange={(e) => onChange(index, "label", e.target.value)}
                        placeholder="e.g., Date, Time, Location"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Value</Label>
                    <Input
                        value={detail.value}
                        onChange={(e) => onChange(index, "value", e.target.value)}
                        placeholder="Enter the value"
                    />
                </div>
            </div>
        </div>
    );
}