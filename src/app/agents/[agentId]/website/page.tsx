"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Globe, Loader2, CheckCircle2, AlertCircle, Link2, Trash2 } from "lucide-react";
import { handleAPIError } from "@/lib/api";
import { useKnowledgeBasesByCategory } from "@/hooks/useKnowledgeBasesByCategory";
import { useDeleteKnowledgeBase } from "@/hooks/useDeleteKnowledgeBase";
import { useUploadWebsite } from "@/hooks/useUploadWebsite";

export default function AgentWebsitePage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.agentId as string;

  const [websiteName, setWebsiteName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");

  // TanStack Query hooks
  const { data: kbData, isLoading } = useKnowledgeBasesByCategory(agentId, "WEBSITE");
  const deleteKnowledgeBase = useDeleteKnowledgeBase();
  const uploadWebsite = useUploadWebsite();

  const knowledgeBases = kbData?.knowledgeBases || [];

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!websiteUrl.trim()) {
      setError("Please provide a website URL");
      return;
    }

    if (!validateUrl(websiteUrl)) {
      setError("Please provide a valid URL (e.g., https://example.com)");
      return;
    }

    try {
      setError("");
      setUploadSuccess(false);

      await uploadWebsite.mutateAsync({
        agentId,
        websiteUrl,
        name: websiteName.trim() || undefined,
      });

      setUploadSuccess(true);
      setTimeout(() => {
        setWebsiteName("");
        setWebsiteUrl("");
        setUploadSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Error uploading website:", err);
      setError(handleAPIError(err));
    }
  };

  const handleDelete = async (kbId: string) => {
    if (!confirm("Are you sure you want to delete this website? This action cannot be undone.")) {
      return;
    }

    deleteKnowledgeBase.mutate(kbId, {
      onError: (error) => {
        console.error("Error deleting knowledge base:", error);
        alert("Failed to delete website. Please try again.");
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
          <h1 className="text-3xl font-bold mb-2">Website Sources</h1>
          <p className="text-muted-foreground">
            Import and manage content from websites to train your chatbot
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
                <Globe className="w-5 h-5 text-primary" />
                Website Sources ({knowledgeBases.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {knowledgeBases.map((kb) => (
                  <motion.div
                    key={kb.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <Globe className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{kb.name}</h3>
                          {kb.metadata?.url && (
                            <a
                              href={kb.metadata.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline truncate block"
                            >
                              {kb.metadata.url}
                            </a>
                          )}
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
              <Globe className="w-5 h-5 text-primary" />
              Website URL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Website URL */}
              <div className="space-y-2">
                <label htmlFor="websiteUrl" className="text-sm font-medium">
                  Website URL <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="websiteUrl"
                    type="url"
                    placeholder="https://example.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    disabled={isUploading}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the full URL including https://
                </p>
              </div>

              {/* Website Name (Optional) */}
              <div className="space-y-2">
                <label htmlFor="websiteName" className="text-sm font-medium">
                  Custom Name{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </label>
                <Input
                  id="websiteName"
                  placeholder="e.g., Company Documentation"
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  disabled={isUploading}
                />
                <p className="text-xs text-muted-foreground">
                  If not provided, we'll use the website's title
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
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
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
                    Website scraping started successfully! Processing may take a few
                    moments.
                  </p>
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={uploadWebsite.isPending || !websiteUrl.trim()}
                  className="min-w-[150px]"
                >
                  {uploadWebsite.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Scraping...
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 mr-2" />
                      Scrape Website
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={uploadWebsite.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border border-border bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg">What Gets Scraped?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Main content and text from the page</p>
                <p>• Headings and subheadings</p>
                <p>• Paragraph text and lists</p>
                <p>• Metadata and descriptions</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border border-border bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg">Best Practices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Ensure you have permission to scrape the website</p>
                <p>• Use publicly accessible URLs</p>
                <p>• Wait for processing to complete before testing</p>
                <p>• Content is extracted and indexed automatically</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
