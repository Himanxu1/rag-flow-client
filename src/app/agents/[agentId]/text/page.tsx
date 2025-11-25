"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { handleAPIError } from "@/lib/api";
import { useKnowledgeBasesByCategory } from "@/hooks/useKnowledgeBasesByCategory";
import { useDeleteKnowledgeBase } from "@/hooks/useDeleteKnowledgeBase";
import { useUploadText } from "@/hooks/useUploadText";

export default function AgentTextPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.agentId as string;

  const [textName, setTextName] = useState("");
  const [textContent, setTextContent] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");

  // TanStack Query hooks
  const { data: kbData, isLoading } = useKnowledgeBasesByCategory(
    agentId,
    "TEXT"
  );
  const deleteKnowledgeBase = useDeleteKnowledgeBase();
  const uploadText = useUploadText();

  const knowledgeBases = kbData?.knowledgeBases || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!textName.trim() || !textContent.trim()) {
      setError("Please provide both name and content");
      return;
    }

    try {
      setError("");
      setUploadSuccess(false);

      await uploadText.mutateAsync({
        agentId,
        text: textContent,
        name: textName,
      });

      setUploadSuccess(true);
      setTimeout(() => {
        setTextName("");
        setTextContent("");
        setUploadSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Error uploading text:", err);
      setError(handleAPIError(err));
    }
  };

  const handleDelete = async (kbId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this text? This action cannot be undone."
      )
    ) {
      return;
    }

    deleteKnowledgeBase.mutate(kbId, {
      onError: (error) => {
        console.error("Error deleting knowledge base:", error);
        alert("Failed to delete text. Please try again.");
      },
    });
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
          <h1 className="text-3xl font-bold mb-2">Text Sources</h1>
          <p className="text-muted-foreground">
            Add and manage custom text content to train your chatbot
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
                Text Content ({knowledgeBases.length})
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
                              className={`text-xs px-2 py-1 rounded-full ${
                                kb.status === "READY"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                  : kb.status === "PROCESSING"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                  : kb.status === "FAILED"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                              }`}
                            >
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

        {/* Upload Form */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Text Input
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Text Name */}
              <div className="space-y-2">
                <label htmlFor="textName" className="text-sm font-medium">
                  Content Name
                </label>
                <Input
                  id="textName"
                  placeholder="e.g., Product Documentation"
                  value={textName}
                  onChange={(e) => setTextName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Text Content */}
              <div className="space-y-2">
                <label htmlFor="textContent" className="text-sm font-medium">
                  Content
                </label>
                <Textarea
                  id="textContent"
                  placeholder="Paste your text content here..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  disabled={isLoading}
                  className="min-h-[300px] resize-y"
                />
                <p className="text-xs text-muted-foreground">
                  {textContent.length} characters
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </motion.div>
              )}

              {/* Success Message */}
              {uploadSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Text content uploaded successfully!
                  </p>
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={
                    uploadText.isPending ||
                    !textName.trim() ||
                    !textContent.trim()
                  }
                  className="min-w-[150px]"
                >
                  {uploadText.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Upload Text
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={uploadText.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mt-6 border border-border bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Tips for Text Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Keep content well-organized with clear sections</p>
              <p>• Use descriptive names to easily identify content later</p>
              <p>• Break large documents into smaller, focused pieces</p>
              <p>• Include relevant keywords for better search results</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
