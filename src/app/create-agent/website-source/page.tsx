"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronUp, Info, Globe, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useCreateAgentStore } from "@/store/createAgentStore";
import UploadedFilesList from "@/components/upload-file-list";

const WebsiteSource = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteName, setWebsiteName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const addUploadedFile = useCreateAgentStore((state) => state.addUploadedFile);

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleAddWebsite = async () => {
    if (!websiteUrl.trim()) {
      alert("Please enter a website URL");
      return;
    }

    // Validate URL
    if (!validateUrl(websiteUrl)) {
      alert("Please enter a valid URL (must start with http:// or https://)");
      return;
    }

    const name = websiteName.trim() || websiteUrl;
    setIsAdding(true);

    try {
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Add to temporary storage
      addUploadedFile({
        id: `website-${Date.now()}`,
        name,
        type: "WEBSITE",
        uploadedAt: new Date().toISOString(),
        url: websiteUrl,
      });

      // Clear inputs
      setWebsiteUrl("");
      setWebsiteName("");
    } catch (error) {
      console.error("Error adding website:", error);
      alert("Failed to add website");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-foreground text-background px-2 py-1 rounded text-sm font-semibold">
              Website
            </span>
          </div>
          <p className="text-foreground text-base">
            Add websites to crawl and train your AI. Perfect for documentation
            sites, blogs, or knowledge bases.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 whitespace-nowrap bg-transparent"
        >
          <Info className="w-4 h-4" />
          Learn more
        </Button>
      </div>

      {/* Add Website Card */}
      <Card className="border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <h2 className="text-xl font-bold">Add website</h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronUp
              className={`w-5 h-5 transition-transform ${
                isExpanded ? "rotate-0" : "rotate-180"
              }`}
            />
          </button>
        </CardHeader>

        {isExpanded && (
          <CardContent className="space-y-4">
            {/* Info Alert */}
            <Alert className="border-green-200 bg-green-50 text-green-900">
              <Info className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Enter a website URL to crawl and extract content. The AI will
                learn from all accessible pages on the site.
              </AlertDescription>
            </Alert>

            {/* Website Name Input */}
            <div className="space-y-2">
              <label htmlFor="websiteName" className="text-sm font-medium">
                Name (optional)
              </label>
              <Input
                id="websiteName"
                type="text"
                placeholder="e.g., Documentation, Blog..."
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                disabled={isAdding}
              />
            </div>

            {/* Website URL Input */}
            <div className="space-y-2">
              <label htmlFor="websiteUrl" className="text-sm font-medium">
                Website URL *
              </label>
              <Input
                id="websiteUrl"
                type="url"
                placeholder="https://example.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                disabled={isAdding}
              />
              <p className="text-xs text-muted-foreground">
                Must start with http:// or https://
              </p>
            </div>

            {/* Add Button */}
            <Button
              onClick={handleAddWebsite}
              disabled={isAdding || !websiteUrl.trim()}
              className="w-full"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  Add Website
                </>
              )}
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Display uploaded websites */}
      <UploadedFilesList filterType="WEBSITE" />
    </div>
  );
};

export default WebsiteSource;
