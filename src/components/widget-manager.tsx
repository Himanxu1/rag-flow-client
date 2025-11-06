"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, Send, Loader2 } from "lucide-react";
import { settingsAPI, handleAPIError, type ChatbotSettings } from "@/lib/api";

interface ChatbotConfig {
  color: string;
  fontFamily: string;
  placeholderMessage: string;
  accentColor: string;
  welcomeMessage: string;
  widgetPosition: string;
}

interface WidgetManagerProps {
  onClose: () => void;
  chatbotId: string;
}

const colorOptions = [
  { name: "Blue", value: "bg-blue-500", hex: "#3b82f6" },
  { name: "Purple", value: "bg-purple-500", hex: "#a855f7" },
  { name: "Green", value: "bg-green-500", hex: "#22c55e" },
  { name: "Red", value: "bg-red-500", hex: "#ef4444" },
  { name: "Orange", value: "bg-orange-500", hex: "#f97316" },
  { name: "Pink", value: "bg-pink-500", hex: "#ec4899" },
];

const fontOptions = [
  { name: "Sans", value: "font-sans" },
  { name: "Serif", value: "font-serif" },
  { name: "Mono", value: "font-mono" },
];

export function WidgetManager({ onClose, chatbotId }: WidgetManagerProps) {
  const [config, setConfig] = useState<ChatbotConfig>({
    color: "#3b82f6",
    fontFamily: "font-sans",
    placeholderMessage: "Ask a question...",
    accentColor: "#3b82f6",
    welcomeMessage: "Hi! How can I help you today?",
    widgetPosition: "bottom-right",
  });

  const [messages, setMessages] = useState<
    { id: string; text: string; sender: "user" | "bot" }[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [inputValue, setInputValue] = useState("");

  // Load settings from backend
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const response = await settingsAPI.get(chatbotId);

        if (response.success && response.settings) {
          const settings = response.settings;
          setConfig({
            color: settings.primaryColor || "#3b82f6",
            fontFamily: settings.fontFamily || "font-sans",
            placeholderMessage: settings.placeholderMessage || "Ask a question...",
            accentColor: settings.primaryColor || "#3b82f6",
            welcomeMessage: settings.welcomeMessage || "Hi! How can I help you today?",
            widgetPosition: settings.widgetPosition || "bottom-right",
          });

          // Set initial welcome message
          setMessages([{
            id: "1",
            text: settings.welcomeMessage || "Hi there! How can I help you?",
            sender: "bot",
          }]);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        // Use default welcome message on error
        setMessages([{
          id: "1",
          text: config.welcomeMessage,
          sender: "bot",
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [chatbotId]);

  // Save settings to backend
  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);

      const settingsData: Partial<ChatbotSettings> = {
        primaryColor: config.color,
        fontFamily: config.fontFamily,
        placeholderMessage: config.placeholderMessage,
        welcomeMessage: config.welcomeMessage,
        widgetPosition: config.widgetPosition as any,
      };

      await settingsAPI.update(chatbotId, settingsData);

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert(`Failed to save settings: ${handleAPIError(error)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user" as const,
    };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message!",
        sender: "bot" as const,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);

    setInputValue("");
  };

  const getRgbFromHex = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgb(${Number.parseInt(result[1], 16)}, ${Number.parseInt(
          result[2],
          16
        )}, ${Number.parseInt(result[3], 16)})`
      : hex;
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col border border-border items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-background">
          <h2 className="text-2xl font-bold">Manage Chat Widget</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex gap-6 p-6">
          {/* Configuration Panel */}
          <div className="w-80 overflow-y-auto space-y-6 pr-4">
            <div>
              <label className="block text-sm font-semibold mb-3">
                Primary Color
              </label>
              <div className="grid grid-cols-3 gap-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.hex}
                    onClick={() =>
                      setConfig({
                        ...config,
                        color: option.hex,
                        accentColor: option.hex,
                      })
                    }
                    className="relative p-3 rounded-lg border-2 transition-all hover:scale-105"
                    style={{
                      backgroundColor: option.hex,
                      borderColor:
                        config.color === option.hex ? "#000" : "transparent",
                    }}
                    title={option.name}
                  >
                    {config.color === option.hex && (
                      <span className="text-white text-sm font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Custom Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={config.color}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      color: e.target.value,
                      accentColor: e.target.value,
                    })
                  }
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <Input
                  value={config.color}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      color: e.target.value,
                      accentColor: e.target.value,
                    })
                  }
                  placeholder="#3b82f6"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">
                Font Family
              </label>
              <div className="space-y-2">
                {fontOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setConfig({ ...config, fontFamily: option.value })
                    }
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      option.value
                    } ${
                      config.fontFamily === option.value
                        ? "border-primary bg-secondary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Welcome Message
              </label>
              <Input
                value={config.welcomeMessage}
                onChange={(e) => {
                  const newMessage = e.target.value;
                  setConfig({ ...config, welcomeMessage: newMessage });
                  // Update first message
                  if (messages.length > 0 && messages[0].sender === "bot") {
                    setMessages([
                      { ...messages[0], text: newMessage },
                      ...messages.slice(1),
                    ]);
                  }
                }}
                placeholder="Hi! How can I help you today?"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Placeholder Message
              </label>
              <Input
                value={config.placeholderMessage}
                onChange={(e) =>
                  setConfig({ ...config, placeholderMessage: e.target.value })
                }
                placeholder="Enter placeholder text..."
                className="w-full"
              />
            </div>

            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Tip:</strong> All changes are applied in real-time to
                the preview on the right.
              </p>
            </div>
          </div>

          {/* Chat Widget Preview */}
          <div className="flex-1 overflow-hidden flex flex-col bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-4">
            <div
              className="flex-1 overflow-hidden flex flex-col bg-white rounded-lg shadow-lg"
              style={{ fontFamily: "inherit" }}
            >
              {/* Header */}
              <div
                className="px-6 py-4 text-white rounded-t-lg flex items-center justify-between"
                style={{ backgroundColor: config.color }}
              >
                <div>
                  <h3 className="font-bold text-lg">Support Agent</h3>
                  <p className="text-xs opacity-90">Always here to help</p>
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                        msg.sender === "user"
                          ? "text-white rounded-br-none"
                          : "bg-slate-200 text-slate-900 rounded-bl-none"
                      }`}
                      style={
                        msg.sender === "user"
                          ? { backgroundColor: config.color }
                          : {}
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-border flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder={config.placeholderMessage}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  size="sm"
                  style={{ backgroundColor: config.color }}
                  className="text-white hover:opacity-90"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-background flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Your widget is customized and ready to deploy
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Close
            </Button>
            <Button
              onClick={handleSaveSettings}
              disabled={isSaving || isLoading}
              style={{ backgroundColor: config.color }}
              className="text-white hover:opacity-90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save & Deploy"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
