"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronUp, Info, FileText, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useCreateAgentStore } from "@/store/createAgentStore";
import UploadedFilesList from "@/components/UploadedFilesList";

const TextSource = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [textContent, setTextContent] = useState("");
  const [textName, setTextName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const addUploadedFile = useCreateAgentStore((state) => state.addUploadedFile);

  const handleAddText = async () => {
    if (!textContent.trim()) {
      alert("Please enter text content");
      return;
    }

    const name = textName.trim() || `Text-${Date.now()}`;
    setIsAdding(true);

    try {
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Add to temporary storage
      addUploadedFile({
        id: `text-${Date.now()}`,
        name,
        type: "TEXT",
        uploadedAt: new Date().toISOString(),
        content: textContent,
      });

      // Clear inputs
      setTextContent("");
      setTextName("");
    } catch (error) {
      console.error("Error adding text:", error);
      alert("Failed to add text");
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
              Text
            </span>
          </div>
          <p className="text-foreground text-base">
            Add text content to train your AI. Perfect for FAQs, documentation, or any text-based information.
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

      {/* Add Text Card */}
      <Card className="border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <h2 className="text-xl font-bold">Add text</h2>
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
            <Alert className="border-blue-200 bg-blue-50 text-blue-900">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Add any text content you want your AI to learn from. This could be FAQs, product descriptions, documentation, or any other text.
              </AlertDescription>
            </Alert>

            {/* Text Name Input */}
            <div className="space-y-2">
              <label htmlFor="textName" className="text-sm font-medium">
                Name (optional)
              </label>
              <Input
                id="textName"
                type="text"
                placeholder="e.g., Company FAQ, Product Info..."
                value={textName}
                onChange={(e) => setTextName(e.target.value)}
                disabled={isAdding}
              />
            </div>

            {/* Text Content Textarea */}
            <div className="space-y-2">
              <label htmlFor="textContent" className="text-sm font-medium">
                Text Content *
              </label>
              <textarea
                id="textContent"
                className="w-full border border-border rounded-lg p-3 bg-background text-sm min-h-64 resize-y focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Paste your text content here...&#10;&#10;You can include multiple paragraphs, bullet points, or any formatted text."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                disabled={isAdding}
              />
              <p className="text-xs text-muted-foreground">
                {textContent.length} characters
              </p>
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleAddText}
              disabled={isAdding || !textContent.trim()}
              className="w-full"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Add Text
                </>
              )}
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Display uploaded texts */}
      <UploadedFilesList filterType="TEXT" />
    </div>
  );
};

export default TextSource;
