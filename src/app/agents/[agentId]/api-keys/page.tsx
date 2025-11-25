"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Shield,
} from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  permissions: string[];
  chatbotId?: string;
  lastUsedAt?: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export default function ApiKeysPage() {
  const params = useParams();
  const agentId = params.agentId as string;

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, [agentId]);

  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/v1/apikey/chatbot/${agentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setApiKeys(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch API keys");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      setError("Please enter a name for the API key");
      return;
    }

    try {
      setIsCreating(true);
      setError(null);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/v1/apikey/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newKeyName,
          chatbotId: agentId,
          permissions: ["chat:query"],
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCreatedKey(data.data.key);
        setNewKeyName("");
        fetchApiKeys();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to create API key");
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const deleteApiKey = async (keyId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/v1/apikey/${keyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        fetchApiKeys();
        setDeleteKeyId(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to delete API key");
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">API Keys</h1>
          <p className="text-muted-foreground">
            Manage API keys for programmatic access to your chatbot
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Info Card */}
        <Card className="mb-6 border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Security Best Practices
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• API keys are shown only once during creation. Save them securely!</li>
                  <li>• Never commit API keys to version control</li>
                  <li>• Revoke keys immediately if compromised</li>
                  <li>• Use different keys for development and production</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Key Button */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="lg" className="mb-6">
              <Plus className="w-4 h-4 mr-2" />
              Create New API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Give your API key a descriptive name to remember where it's used
              </DialogDescription>
            </DialogHeader>

            {createdKey ? (
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Save this key now!</strong> You won't be able to see it again.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>Your API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      value={createdKey}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      size="icon"
                      onClick={() => copyKey(createdKey)}
                      variant="outline"
                    >
                      {copiedKey ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg text-sm">
                  <p className="font-semibold mb-2">Usage Example:</p>
                  <code className="text-xs">
                    curl -X POST http://localhost:3001/api/v1/chat/public/:embedId \<br />
                    &nbsp;&nbsp;-H "x-api-key: {createdKey}" \<br />
                    &nbsp;&nbsp;-d '{"{"}"question": "Hello"{"}"}'
                  </code>
                </div>

                <Button
                  onClick={() => {
                    setCreatedKey(null);
                    setShowCreateDialog(false);
                  }}
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keyName">API Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="e.g., Production API, Development Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !isCreating) {
                        createApiKey();
                      }
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={createApiKey}
                    disabled={isCreating || !newKeyName.trim()}
                    className="flex-1"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4 mr-2" />
                        Create Key
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateDialog(false);
                      setNewKeyName("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* API Keys List */}
        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        ) : apiKeys.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Key className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No API Keys Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first API key to start integrating with your chatbot
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create API Key
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <motion.div
                key={apiKey.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="border border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Key className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold">{apiKey.name}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              apiKey.isActive
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {apiKey.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p className="font-mono">{apiKey.keyPrefix}</p>
                          <div className="flex items-center gap-4">
                            <span>Created: {formatDate(apiKey.createdAt)}</span>
                            {apiKey.lastUsedAt && (
                              <span>Last used: {formatDate(apiKey.lastUsedAt)}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              {apiKey.permissions.join(", ")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeleteKeyId(apiKey.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteKeyId} onOpenChange={() => setDeleteKeyId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete API Key?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Applications using this key will immediately
                lose access to your chatbot.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteKeyId && deleteApiKey(deleteKeyId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Key
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  );
}
