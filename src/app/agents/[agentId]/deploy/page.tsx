"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WidgetManager } from "@/components/widget-manager";
import { Copy, Check, Code } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Channel {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  enabled: boolean;
  action: string;
}

const AgentDeploy = () => {
  const params = useParams();
  const agentId = params.agentId as string;

  const [channels, setChannels] = useState<Channel[]>([
    {
      id: "widget",
      title: "Chat widget",
      description: "Add a floating chat window to your site",
      icon: "💬",
      color: "from-blue-400 to-cyan-400",
      enabled: true,
      action: "Manage",
    },
    {
      id: "help-page",
      title: "Help page",
      description:
        "ChatGPT-style help page, deployed standalone or under a path on your site (/help).",
      icon: "❓",
      color: "from-yellow-400 to-orange-400",
      enabled: false,
      action: "Setup",
    },
  ]);

  const [showWidgetManager, setShowWidgetManager] = useState(false);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [embedId, setEmbedId] = useState<string>("");

  // Generate embed code
  const embedCode = `<!-- Chatbase RAG Widget -->
<script
  src="http://localhost:3001/embed.js"
  data-embed-id="${embedId || agentId}"
  data-chatbot-id="${agentId}"
  data-position="bottom-right"
  data-color="#4F46E5"
  data-welcome-message="Hi! How can I help you today?"
></script>`;

  useEffect(() => {
    // In a real app, you'd fetch the embedId from the backend
    // For now, we'll use the agentId
    setEmbedId(agentId);
  }, [agentId]);

  const integrations = [
    {
      id: "zapier",
      title: "Zapier",
      description: "Connect your agent with thousands of apps using Zapier.",
      logo: "⚡",
      action: "Setup",
    },
    {
      id: "slack",
      title: "Slack",
      description:
        "Connect your agent to Slack, mention it, and have it reply to any message.",
      logo: "💼",
      action: "Setup",
    },
    {
      id: "wordpress",
      title: "WordPress",
      description:
        "Use the official Chatbase plugin for WordPress to add the chat widget to your website.",
      logo: "📰",
      action: "Setup",
    },
  ];

  const toggleChannel = (id: string) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, enabled: !ch.enabled } : ch))
    );
  };

  const handleChannelAction = (id: string) => {
    if (id === "widget") {
      setShowWidgetManager(true);
    }
  };

  const copyEmbedCode = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Deploy</h1>
        <p className="text-muted-foreground">
          Connect and deploy your chatbot to multiple platforms
        </p>
      </div>

      {/* Embed Code Section */}
      <Card className="mb-8 p-6 border border-border">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-2">Embed Code</h2>
            <p className="text-sm text-muted-foreground">
              Copy and paste this code into your website's HTML to add the chat
              widget.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEmbedCode(!showEmbedCode)}
          >
            <Code size={16} className="mr-2" />
            {showEmbedCode ? "Hide" : "Show"} Code
          </Button>
        </div>

        {showEmbedCode && (
          <div className="mt-4">
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm border border-border">
                <code>{embedCode}</code>
              </pre>
              <Button
                size="sm"
                className="absolute top-2 right-2"
                onClick={copyEmbedCode}
              >
                {copiedCode ? (
                  <>
                    <Check size={16} className="mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} className="mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
              <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
                <li>Copy the embed code above</li>
                <li>
                  Paste it before the closing &lt;/body&gt; tag in your HTML
                </li>
                <li>The widget will appear in the bottom-right corner</li>
                <li>Customize the position and color using data attributes</li>
              </ol>
            </div>

            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h3 className="font-semibold text-amber-900 mb-2">
                Customization options:
              </h3>
              <div className="text-sm text-amber-800 space-y-1">
                <p>
                  <code className="bg-amber-100 px-2 py-1 rounded">
                    data-position
                  </code>{" "}
                  - "bottom-right", "bottom-left", "top-right", "top-left"
                </p>
                <p>
                  <code className="bg-amber-100 px-2 py-1 rounded">
                    data-color
                  </code>{" "}
                  - Any hex color code (e.g., "#4F46E5")
                </p>
                <p>
                  <code className="bg-amber-100 px-2 py-1 rounded">
                    data-welcome-message
                  </code>{" "}
                  - Custom welcome message
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">All channels</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {channels.map((channel) => (
            <Card
              key={channel.id}
              className="overflow-hidden border border-border"
            >
              <div className={`h-32 bg-gradient-to-br ${channel.color}`}></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{channel.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {channel.description}
                    </p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channel.enabled}
                      onChange={() => toggleChannel(channel.id)}
                      className="w-5 h-5 rounded accent-green-500"
                    />
                  </label>
                </div>
                <div className="flex gap-3 mt-4">
                  {channel.id === "widget" && (
                    <Button variant="outline" size="sm" onClick={copyEmbedCode}>
                      {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => handleChannelAction(channel.id)}
                  >
                    {channel.action}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {showWidgetManager && (
        <WidgetManager
          onClose={() => setShowWidgetManager(false)}
          chatbotId={agentId}
        />
      )}
    </div>
  );
};

export default AgentDeploy;
