"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Zap,
  Webhook,
  Plus,
  Trash2,
  ExternalLink,
  Code,
  Globe,
  Mail,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Action {
  id: string;
  name: string;
  type: "webhook" | "api" | "email" | "custom";
  trigger: "message_received" | "conversation_start" | "conversation_end";
  config: {
    url?: string;
    method?: string;
    headers?: string;
    body?: string;
    email?: string;
  };
  enabled: boolean;
}

export default function ActionsPage() {
  const params = useParams();
  const agentId = params.agentId as string;

  const [actions, setActions] = useState<Action[]>([
    {
      id: "1",
      name: "Notify on new conversation",
      type: "webhook",
      trigger: "conversation_start",
      config: {
        url: "https://hooks.example.com/new-conversation",
        method: "POST",
      },
      enabled: true,
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newAction, setNewAction] = useState<Partial<Action>>({
    type: "webhook",
    trigger: "message_received",
    config: {
      method: "POST",
    },
    enabled: true,
  });

  const handleCreateAction = () => {
    if (newAction.name && newAction.type && newAction.trigger) {
      const action: Action = {
        id: Date.now().toString(),
        name: newAction.name,
        type: newAction.type as Action["type"],
        trigger: newAction.trigger as Action["trigger"],
        config: newAction.config || {},
        enabled: newAction.enabled || true,
      };
      setActions([...actions, action]);
      setIsCreating(false);
      setNewAction({
        type: "webhook",
        trigger: "message_received",
        config: { method: "POST" },
        enabled: true,
      });
    }
  };

  const handleDeleteAction = (id: string) => {
    if (confirm("Are you sure you want to delete this action?")) {
      setActions(actions.filter((action) => action.id !== id));
    }
  };

  const toggleAction = (id: string) => {
    setActions(
      actions.map((action) =>
        action.id === id ? { ...action, enabled: !action.enabled } : action
      )
    );
  };

  const getActionIcon = (type: Action["type"]) => {
    switch (type) {
      case "webhook":
        return Webhook;
      case "api":
        return Globe;
      case "email":
        return Mail;
      case "custom":
        return Code;
      default:
        return Zap;
    }
  };

  const getTriggerLabel = (trigger: Action["trigger"]) => {
    switch (trigger) {
      case "message_received":
        return "On Message Received";
      case "conversation_start":
        return "On Conversation Start";
      case "conversation_end":
        return "On Conversation End";
      default:
        return trigger;
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Actions</h1>
          <p className="text-muted-foreground mt-1">
            Configure webhooks, integrations, and custom actions
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Action
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Actions</p>
                <p className="text-3xl font-bold mt-2">{actions.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Actions</p>
                <p className="text-3xl font-bold mt-2">
                  {actions.filter((a) => a.enabled).length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <Zap className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Webhooks</p>
                <p className="text-3xl font-bold mt-2">
                  {actions.filter((a) => a.type === "webhook").length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <Webhook className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create New Action Form */}
      {isCreating && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Create New Action</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Action Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Send notification"
                  value={newAction.name || ""}
                  onChange={(e) =>
                    setNewAction({ ...newAction, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Action Type</Label>
                <Select
                  value={newAction.type}
                  onValueChange={(value) =>
                    setNewAction({
                      ...newAction,
                      type: value as Action["type"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="api">API Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="custom">Custom Function</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trigger">Trigger Event</Label>
              <Select
                value={newAction.trigger}
                onValueChange={(value) =>
                  setNewAction({
                    ...newAction,
                    trigger: value as Action["trigger"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="message_received">
                    On Message Received
                  </SelectItem>
                  <SelectItem value="conversation_start">
                    On Conversation Start
                  </SelectItem>
                  <SelectItem value="conversation_end">
                    On Conversation End
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newAction.type === "webhook" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="url">Webhook URL</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://your-webhook-url.com/endpoint"
                    value={newAction.config?.url || ""}
                    onChange={(e) =>
                      setNewAction({
                        ...newAction,
                        config: { ...newAction.config, url: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="method">HTTP Method</Label>
                  <Select
                    value={newAction.config?.method || "POST"}
                    onValueChange={(value) =>
                      setNewAction({
                        ...newAction,
                        config: { ...newAction.config, method: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headers">Headers (JSON)</Label>
                  <Textarea
                    id="headers"
                    placeholder='{"Authorization": "Bearer token"}'
                    value={newAction.config?.headers || ""}
                    onChange={(e) =>
                      setNewAction({
                        ...newAction,
                        config: {
                          ...newAction.config,
                          headers: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </>
            )}

            {newAction.type === "email" && (
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="notifications@example.com"
                  value={newAction.config?.email || ""}
                  onChange={(e) =>
                    setNewAction({
                      ...newAction,
                      config: { ...newAction.config, email: e.target.value },
                    })
                  }
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleCreateAction}>Create Action</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setNewAction({
                    type: "webhook",
                    trigger: "message_received",
                    config: { method: "POST" },
                    enabled: true,
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions List */}
      <div className="grid grid-cols-1 gap-4">
        {actions.length === 0 ? (
          <Card className="border border-border">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <Zap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No actions yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first action to automate workflows and integrate
                  with other services.
                </p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Action
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          actions.map((action) => {
            const Icon = getActionIcon(action.type);
            return (
              <Card
                key={action.id}
                className={`border ${
                  action.enabled ? "border-border" : "border-muted opacity-60"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`p-3 rounded-lg ${
                          action.enabled ? "bg-primary/10" : "bg-muted"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            action.enabled
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {action.name}
                          </h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              action.enabled
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {action.enabled ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Type:</span>
                            <span className="capitalize">{action.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Trigger:</span>
                            <span>{getTriggerLabel(action.trigger)}</span>
                          </div>
                          {action.config.url && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">URL:</span>
                              <a
                                href={action.config.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                {action.config.url}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                          {action.config.email && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Email:</span>
                              <span>{action.config.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant={action.enabled ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleAction(action.id)}
                      >
                        {action.enabled ? "Disable" : "Enable"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteAction(action.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Help Section */}
      <Card className="border border-border bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">About Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Actions allow you to automate workflows and integrate your chatbot
            with external services.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <strong>Webhooks:</strong> Send HTTP requests to external
              endpoints when events occur
            </li>
            <li>
              <strong>Email:</strong> Send email notifications for important
              events
            </li>
            <li>
              <strong>Custom Functions:</strong> Execute custom JavaScript code
              (coming soon)
            </li>
          </ul>
          <p className="mt-4">
            <strong>Note:</strong> This is a demo interface. Backend integration
            is required for production use.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
