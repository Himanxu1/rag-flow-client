"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronUp, Info, Upload } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const FileSource = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadFile, setUploadFile] = useState<Blob | null>(null);
  const { token, isAuthenticated } = useAuthStore();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  /**
   * this function is used to upload the file , after the upload it
   * should be running automatically
   * 1. send the file and create knowledge base record database
   *
   */

  const handlePdfUpload = async () => {
    const formData = new FormData();
    if (uploadFile) {
      formData.append("pdf", uploadFile);
    }

    console.log("token", token);
    const response = await axios.post(
      "http://localhost:3001/api/v1/chatbot/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response, "response");
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    setUploadFile(file);
    console.log("Files dropped:", file);
  };

  const handleFileSelect = (e: any) => {
    const file = e.target.files[0];
    console.log("her");
    setUploadFile(file);
    handlePdfUpload();
  };
  return (
    <div>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-foreground text-background px-2 py-1 rounded text-sm font-semibold">
                Files
              </span>
            </div>
            <p className="text-foreground text-base">
              Upload documents to train your AI. Extract text from PDFs, DOCX,
              and TXT files.
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

        {/* Add Files Card */}
        <Card className="border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <h2 className="text-xl font-bold">Add files</h2>
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
              {/* Warning Alert */}
              <Alert className="border-amber-200 bg-amber-50 text-amber-900">
                <Info className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  If you are uploading a PDF, make sure you can select/highlight
                  the text.
                </AlertDescription>
              </Alert>

              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/30 hover:bg-muted/50"
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center justify-center gap-3">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <p className="text-foreground font-medium">
                      Drag & drop files here, or click to select files
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Supported file types: pdf, doc, docx, txt
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Uploaded Files option */}
    </div>
  );
};

export default FileSource;
