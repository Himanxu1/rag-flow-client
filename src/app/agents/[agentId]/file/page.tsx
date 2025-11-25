"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  FileUp,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Trash2,
} from "lucide-react";
import { handleAPIError } from "@/lib/api";
import { useKnowledgeBasesByCategory } from "@/hooks/useKnowledgeBasesByCategory";
import { useDeleteKnowledgeBase } from "@/hooks/useDeleteKnowledgeBase";
import { useUploadFile } from "@/hooks/useUploadFile";

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

export default function AgentFilePage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.agentId as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // TanStack Query hooks
  const {
    data: kbData,
    isLoading,
    refetch,
  } = useKnowledgeBasesByCategory(agentId, "FILE");
  const deleteKnowledgeBase = useDeleteKnowledgeBase();
  const uploadFile = useUploadFile();

  const knowledgeBases = kbData?.knowledgeBases || [];

  // Auto-refresh status every 3 seconds if there are processing files
  useEffect(() => {
    const hasProcessing = knowledgeBases.some(
      (kb: any) => kb.status === "PROCESSING" || kb.status === "PENDING"
    );

    if (hasProcessing) {
      const interval = setInterval(() => {
        refetch();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [knowledgeBases, refetch]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      // Accept PDF and common document formats
      const validTypes = [
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      return validTypes.includes(file.type);
    });

    if (validFiles.length === 0) {
      alert("Please select valid file types (PDF, TXT, DOC, DOCX)");
      return;
    }

    validFiles.forEach((file) => {
      const fileId = `${Date.now()}-${Math.random()}`;
      const newFile: UploadingFile = {
        id: fileId,
        file,
        progress: 0,
        status: "uploading",
      };

      setUploadingFiles((prev) => [...prev, newFile]);
      handleUploadFile(file, fileId);
    });
  };

  const handleUploadFile = async (file: File, fileId: string) => {
    try {
      await uploadFile.mutateAsync({
        agentId,
        file,
        onProgress: (progress) => {
          setUploadingFiles((prev) =>
            prev.map((item) =>
              item.id === fileId ? { ...item, progress } : item
            )
          );
        },
      });

      setUploadingFiles((prev) =>
        prev.map((item) =>
          item.id === fileId
            ? { ...item, status: "success", progress: 100 }
            : item
        )
      );

      // Refetch knowledge bases to show the new file
      refetch();

      // Remove successful uploads after 3 seconds
      setTimeout(() => {
        setUploadingFiles((prev) => prev.filter((item) => item.id !== fileId));
      }, 3000);
    } catch (error) {
      const errorMessage = handleAPIError(error);
      setUploadingFiles((prev) =>
        prev.map((item) =>
          item.id === fileId
            ? { ...item, status: "error", error: errorMessage }
            : item
        )
      );
    }
  };

  const handleDelete = async (kbId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this file? This action cannot be undone."
      )
    ) {
      return;
    }

    deleteKnowledgeBase.mutate(kbId, {
      onError: (error) => {
        console.error("Error deleting knowledge base:", error);
        alert("Failed to delete file. Please try again.");
      },
    });
  };

  const removeFile = (fileId: string) => {
    setUploadingFiles((prev) => prev.filter((item) => item.id !== fileId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">File Sources</h1>
          <p className="text-muted-foreground">
            Upload and manage documents to train your chatbot (PDF, TXT, DOC,
            DOCX)
          </p>
        </div>

        {/* Existing Knowledge Bases */}
        {isLoading ? (
          <Card className="border border-border mb-6">
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        ) : knowledgeBases.length > 0 ? (
          <Card className="border border-border mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Uploaded Files ({knowledgeBases.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {knowledgeBases.map((kb: any) => (
                  <motion.div
                    key={kb.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{kb.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                                kb.status === "READY"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                  : kb.status === "PROCESSING" ||
                                    kb.status === "PENDING"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                  : kb.status === "FAILED"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                              }`}
                            >
                              {(kb.status === "PROCESSING" ||
                                kb.status === "PENDING") && (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              )}
                              {kb.status === "READY" && (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                              {kb.status === "FAILED" && (
                                <AlertCircle className="w-3 h-3" />
                              )}
                              {kb.status || "PENDING"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(kb.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {kb.errorMessage && (
                            <p className="text-xs text-red-600 mt-1">
                              {kb.errorMessage}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(kb.id)}
                        disabled={deleteKnowledgeBase.isPending}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        {deleteKnowledgeBase.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Upload Area */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="w-5 h-5 text-primary" />
              File Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/20 hover:border-primary/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.txt,.doc,.docx"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />

              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isDragging ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <FileUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">
                  Drag and drop files here
                </h3>
                <p className="text-muted-foreground mb-4">
                  or click the button below to browse
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <FileUp className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </motion.div>

              <p className="text-xs text-muted-foreground mt-6">
                Supported formats: PDF, TXT, DOC, DOCX
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Uploading Files List */}
        <AnimatePresence>
          {uploadingFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6"
            >
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Uploading Files</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {uploadingFiles.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="border border-border rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="mt-1">
                          {item.status === "uploading" && (
                            <Loader2 className="w-5 h-5 text-primary animate-spin" />
                          )}
                          {item.status === "success" && (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          )}
                          {item.status === "error" && (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <p className="font-medium truncate">
                              {item.file.name}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {(item.file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>

                          {/* Progress Bar */}
                          {item.status === "uploading" && (
                            <div className="space-y-1">
                              <Progress value={item.progress} className="h-2" />
                              <p className="text-xs text-muted-foreground">
                                {item.progress}% uploaded
                              </p>
                            </div>
                          )}

                          {/* Success Message */}
                          {item.status === "success" && (
                            <p className="text-sm text-green-600">
                              Upload successful!
                            </p>
                          )}

                          {/* Error Message */}
                          {item.status === "error" && (
                            <p className="text-sm text-red-600">
                              {item.error || "Upload failed"}
                            </p>
                          )}
                        </div>

                        {/* Remove Button */}
                        {item.status === "error" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeFile(item.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mt-6 border border-border bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">File Upload Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Maximum file size: 10MB per file</p>
              <p>• Upload multiple files at once for batch processing</p>
              <p>• Files are automatically processed and indexed</p>
              <p>• Processing time depends on file size and complexity</p>
              <p>• PDFs with images may take longer to process</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
