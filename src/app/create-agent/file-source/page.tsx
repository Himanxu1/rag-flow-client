"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronUp, Info, Upload, Loader2, CheckCircle, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { handleAPIError } from "@/lib/api";
import { useCreateAgentStore } from "@/store/createAgentStore";
import UploadedFilesList from "@/components/UploadedFilesList";

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

const FileSource = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const addUploadedFile = useCreateAgentStore((state) => state.addUploadedFile);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    const fileId = `${Date.now()}-${file.name}`;

    // Add to uploading files list
    const newUpload: UploadingFile = {
      id: fileId,
      file,
      progress: 0,
      status: "uploading",
    };
    setUploadingFiles((prev) => [newUpload, ...prev]);

    try {
      // Simulate progress for temporary storage
      const simulateProgress = async () => {
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setUploadingFiles((prev) =>
            prev.map((item) =>
              item.id === fileId ? { ...item, progress: i } : item
            )
          );
        }
      };

      await simulateProgress();

      // Update status to success
      setUploadingFiles((prev) =>
        prev.map((item) =>
          item.id === fileId ? { ...item, status: "success", progress: 100 } : item
        )
      );

      // Add to temporary storage
      addUploadedFile({
        id: fileId,
        name: file.name,
        type: "FILE",
        size: file.size,
        uploadedAt: new Date().toISOString(),
        file: file,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMessage = handleAPIError(error);

      // Update status to error
      setUploadingFiles((prev) =>
        prev.map((item) =>
          item.id === fileId
            ? { ...item, status: "error", error: errorMessage }
            : item
        )
      );
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      await handleFileUpload(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      await handleFileUpload(files[i]);
    }

    // Reset input
    e.target.value = "";
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

              {/* Upload Progress Section */}
              {uploadingFiles.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <h3 className="text-sm font-semibold">Upload Status</h3>
                  {uploadingFiles.slice(0, 5).map((upload) => (
                    <div
                      key={upload.id}
                      className="space-y-2 p-3 rounded-lg border border-border bg-background"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {upload.status === "uploading" && (
                            <Loader2 className="w-4 h-4 animate-spin text-blue-500 flex-shrink-0" />
                          )}
                          {upload.status === "success" && (
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          )}
                          {upload.status === "error" && (
                            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          )}
                          <span className="text-sm font-medium truncate">
                            {upload.file.name}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {upload.status === "uploading" && `${upload.progress}%`}
                          {upload.status === "success" && "Complete"}
                          {upload.status === "error" && "Failed"}
                        </span>
                      </div>
                      {upload.status === "uploading" && (
                        <Progress value={upload.progress} className="h-1" />
                      )}
                      {upload.status === "error" && upload.error && (
                        <p className="text-xs text-red-500">{upload.error}</p>
                      )}
                    </div>
                  ))}
                  {uploadingFiles.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{uploadingFiles.length - 5} more files
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Display uploaded files */}
        <UploadedFilesList filterType="FILE" />
      </div>
    </div>
  );
};

export default FileSource;
