"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Loader2, CheckCircle2, AlertCircle, Save } from "lucide-react";
import { handleAPIError } from "@/lib/api";
import type { ChatbotSettings } from "@/lib/api";
import { useSettings } from "@/hooks/useSettings";
import { useUpdateSettings } from "@/hooks/useUpdateSettings";
import { useResetSettings } from "@/hooks/useResetSettings";

function AgentSettingContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const agentId = params.agentId as string;
  const tabFromUrl = searchParams.get("tab") || "general";

  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  // TanStack Query hooks
  const { data: settingsData, isLoading } = useSettings(agentId);
  const updateSettings = useUpdateSettings();
  const resetSettings = useResetSettings();

  // Local settings state for editing
  const [settings, setSettings] = useState<Partial<ChatbotSettings>>({
    primaryColor: "#3b82f6",
    fontFamily: "font-sans",
    placeholderMessage: "Ask a question...",
    welcomeMessage: "Hi! How can I help you today?",
    widgetPosition: "bottom-right",
    maxContextLength: 5,
    temperature: 0.7,
    modelName: "gpt-3.5-turbo",
    brandingEnabled: true,
  });

  // Update local state when data is loaded
  useEffect(() => {
    if (settingsData?.success && settingsData?.settings) {
      const normalizedSettings = {
        ...settingsData.settings,
        temperature:
          typeof settingsData.settings.temperature === "number"
            ? settingsData.settings.temperature
            : Number(settingsData.settings.temperature || 0.7),
        maxContextLength:
          typeof settingsData.settings.maxContextLength === "number"
            ? settingsData.settings.maxContextLength
            : Number(settingsData.settings.maxContextLength || 5),
      };
      setSettings(normalizedSettings);
    }
  }, [settingsData]);

  // Sync tab with URL parameter
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleSave = async () => {
    try {
      setError("");
      setSaveSuccess(false);

      await updateSettings.mutateAsync({
        agentId,
        settings,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setError(handleAPIError(err));
    }
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset all settings to defaults?"))
      return;

    try {
      setError("");
      const response = await resetSettings.mutateAsync(agentId);

      if (response.success && response.settings) {
        // Ensure numeric values are properly typed
        const normalizedSettings = {
          ...response.settings,
          temperature:
            typeof response.settings.temperature === "number"
              ? response.settings.temperature
              : Number(response.settings.temperature || 0.7),
          maxContextLength:
            typeof response.settings.maxContextLength === "number"
              ? response.settings.maxContextLength
              : Number(response.settings.maxContextLength || 5),
        };
        setSettings(normalizedSettings);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error resetting settings:", err);
      setError(handleAPIError(err));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Configure your chatbot behavior and appearance
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 p-4 mb-6 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </motion.div>
        )}

        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 p-4 mb-6 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-600 dark:text-green-400">
              Settings saved successfully!
            </p>
          </motion.div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="ai">AI Model</TabsTrigger>
            <TabsTrigger value="interface">Interface</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="mt-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 border border-border">
                <h2 className="text-xl font-bold mb-4">General Settings</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="welcomeMessage">Welcome Message</Label>
                    <Input
                      id="welcomeMessage"
                      placeholder="Hi! How can I help you today?"
                      value={settings.welcomeMessage || ""}
                      onChange={(e) =>
                        setSettings({ ...settings, welcomeMessage: e.target.value })
                      }
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="placeholderMessage">Placeholder Message</Label>
                    <Input
                      id="placeholderMessage"
                      placeholder="Ask a question..."
                      value={settings.placeholderMessage || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          placeholderMessage: e.target.value,
                        })
                      }
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="widgetPosition">Widget Position</Label>
                    <select
                      id="widgetPosition"
                      value={settings.widgetPosition || "bottom-right"}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          widgetPosition: e.target.value as any,
                        })
                      }
                      className="w-full mt-2 border border-border rounded-lg p-2 bg-background text-sm"
                    >
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="top-left">Top Left</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="branding">Show Branding</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Display "Powered by" text
                      </p>
                    </div>
                    <Switch
                      id="branding"
                      checked={settings.brandingEnabled ?? true}
                      onCheckedChange={(checked:any) =>
                        setSettings({ ...settings, brandingEnabled: checked })
                      }
                    />
                  </div>
                </div>
              </Card>

              <div className="flex gap-4">
                <Button onClick={handleSave} disabled={updateSettings.isPending}>
                  {updateSettings.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset} disabled={resetSettings.isPending}>
                  Reset to Defaults
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* AI Tab */}
          <TabsContent value="ai" className="mt-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 border border-border">
                <h2 className="text-xl font-bold mb-4">AI Model Settings</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="modelName">Model</Label>
                    <select
                      id="modelName"
                      value={settings.modelName || "gpt-3.5-turbo"}
                      onChange={(e) =>
                        setSettings({ ...settings, modelName: e.target.value })
                      }
                      className="w-full mt-2 border border-border rounded-lg p-2 bg-background text-sm"
                    >
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="temperature">
                      Temperature: {typeof settings.temperature === 'number' ? settings.temperature.toFixed(1) : Number(settings.temperature || 0.7).toFixed(1)}
                    </Label>
                    <Slider
                      id="temperature"
                      min={0}
                      max={1}
                      step={0.1}
                      value={[typeof settings.temperature === 'number' ? settings.temperature : Number(settings.temperature || 0.7)]}
                      onValueChange={([value]) =>
                        setSettings({ ...settings, temperature: value })
                      }
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Lower = more focused, Higher = more creative
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="maxContext">
                      Context Length: {settings.maxContextLength || 5} messages
                    </Label>
                    <Slider
                      id="maxContext"
                      min={1}
                      max={10}
                      step={1}
                      value={[settings.maxContextLength || 5]}
                      onValueChange={([value]) =>
                        setSettings({ ...settings, maxContextLength: value })
                      }
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Number of previous messages to include for context
                    </p>
                  </div>
                </div>
              </Card>

              <div className="flex gap-4">
                <Button onClick={handleSave} disabled={updateSettings.isPending}>
                  {updateSettings.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* Interface Tab */}
          <TabsContent value="interface" className="mt-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 border border-border">
                <h2 className="text-xl font-bold mb-4">Chat Interface</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="primaryColor">Theme Color</Label>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="color"
                        id="primaryColor"
                        value={settings.primaryColor || "#3b82f6"}
                        onChange={(e) =>
                          setSettings({ ...settings, primaryColor: e.target.value })
                        }
                        className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                      />
                      <Input
                        placeholder="#3b82f6"
                        value={settings.primaryColor || ""}
                        onChange={(e) =>
                          setSettings({ ...settings, primaryColor: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <select
                      id="fontFamily"
                      value={settings.fontFamily || "font-sans"}
                      onChange={(e) =>
                        setSettings({ ...settings, fontFamily: e.target.value })
                      }
                      className="w-full mt-2 border border-border rounded-lg p-2 bg-background text-sm"
                    >
                      <option value="font-sans">Sans Serif</option>
                      <option value="font-serif">Serif</option>
                      <option value="font-mono">Monospace</option>
                    </select>
                  </div>
                </div>
              </Card>

              <div className="flex gap-4">
                <Button onClick={handleSave} disabled={updateSettings.isPending}>
                  {updateSettings.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

export default function AgentSettingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <AgentSettingContent />
    </Suspense>
  );
}
