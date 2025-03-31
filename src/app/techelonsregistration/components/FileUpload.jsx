import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, FileIcon } from "lucide-react";
import { toast } from "react-hot-toast";

export default function FileUpload({
  setValue,
  value,
  isSubmitting,
  maxSizeMB = 2,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  // Convert MB to bytes
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  // Handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSizeBytes) {
      toast.error(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    setFileName(file.name);
    setIsUploading(true);
    
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('section', 'techelons');
      
      // Show loading toast
      const loadingToastId = toast.loading('Uploading file...');
      
      // Send the file to the server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }
      
      // Get the URL of the uploaded file
      const data = await response.json();
      
      // Update the form value with the server URL
      setValue("collegeIdUrl", data.url);
      
      // Dismiss loading toast and show success toast
      toast.dismiss(loadingToastId);
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(error.message || 'Failed to upload file. Please try again.');
      setFileName("");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle clear button click
  const handleClear = () => {
    setValue("collegeIdUrl", "");
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle button click to open file dialog
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Check if the value is a file URL
  const isFileUrl = value && (value.startsWith('/api/files/') || value.startsWith('/assets/'));

  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            disabled={isSubmitting || isUploading}
            className="flex-1 h-8 sm:h-10 text-xs sm:text-sm py-1 sm:py-2"
          >
            <Upload className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            {isUploading ? "Uploading..." : "Upload College ID"}
          </Button>
          {value && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleClear}
              disabled={isSubmitting || isUploading}
              className="h-8 w-8 sm:h-10 sm:w-10"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>
        
        {isFileUrl && (
          <div className="flex items-center p-1 sm:p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
            <FileIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-500" />
            <span className="text-xs sm:text-sm truncate">
              {fileName || "Uploaded file"}
              {value.startsWith('/api/files/') && (
                <a 
                  href={value} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-500 hover:underline"
                >
                  View
                </a>
              )}
            </span>
          </div>
        )}
        
        <Input
          type="text"
          value={value || ""}
          onChange={(e) => setValue("collegeIdUrl", e.target.value)}
          placeholder="Or enter drive link directly"
          disabled={isSubmitting || isUploading}
          className="text-xs sm:text-sm h-8 sm:h-10"
        />
      </div>
    </div>
  );
} 