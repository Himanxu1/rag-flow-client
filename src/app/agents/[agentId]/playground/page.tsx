"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Loader2,
  AlertCircle,
  Plus,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { chatAPI, conversationAPI, settingsAPI, handleAPIError } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  sources?: Array<{
    content: string;
    metadata: {
      sourceFile?: string;
      chunkIndex?: number;
    };
  }>;
}

interface ChatbotStatus {
  exists: boolean;
  ready: boolean;
  documentCount: number;
}

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const Playground = () => {
  const params = useParams();
  const agentId = params.agentId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [systemPrompt, setSystemPrompt] = useState(
    `### Role
- Primary Function: You are an AI chatbot who helps users with their inquiries, issues and requests. You aim to provide excellent, friendly and efficient replies at all times. Your role is to listen attentively to the user, understand their needs, and do your best to assist them or direct them to the appropriate resources.`
  );
  const [chatbotStatus, setChatbotStatus] = useState<ChatbotStatus>({
    exists: false,
    ready: false,
    documentCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isSavingPrompt, setIsSavingPrompt] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check chatbot status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        setIsCheckingStatus(true);
        const response = await chatAPI.getStatus(agentId);
        setChatbotStatus(response.data);

        // Add welcome message
        if (response.data.ready) {
          setMessages([
            {
              id: "welcome",
              role: "bot",
              content: `Hi! I'm ready to help. I have been trained on ${response.data.documentCount} document chunks. What can I help you with?`,
            },
          ]);
        } else {
          setMessages([
            {
              id: "welcome",
              role: "bot",
              content:
                "Hi! I'm not fully trained yet. Please upload some documents to get started.",
            },
          ]);
        }
      } catch (error) {
        console.error("Error checking chatbot status:", error);
        setError("Failed to check chatbot status");
      } finally {
        setIsCheckingStatus(false);
      }
    };

    if (agentId) {
      checkStatus();
      loadConversations();
      loadSettings();
    }
  }, [agentId]);

  // Load settings for this chatbot
  const loadSettings = async () => {
    try {
      const response = await settingsAPI.get(agentId);
      if (response.success && response.settings?.systemPrompt) {
        setSystemPrompt(response.settings.systemPrompt);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      // Keep default system prompt if loading fails
    }
  };

  // Save system prompt to settings
  const saveSystemPrompt = async () => {
    try {
      setIsSavingPrompt(true);
      await settingsAPI.update(agentId, { systemPrompt });
      alert("System prompt saved successfully!");
    } catch (error) {
      console.error("Error saving system prompt:", error);
      alert("Failed to save system prompt: " + handleAPIError(error));
    } finally {
      setIsSavingPrompt(false);
    }
  };

  // Load conversations for this chatbot
  const loadConversations = async () => {
    try {
      setIsLoadingConversations(true);
      const response = await conversationAPI.getAll();

      console.log("All conversations from API:", response.data);
      console.log("Current agentId:", agentId);

      if (response.success && response.data) {
        // Filter conversations for this chatbot
        const chatbotConversations = response.data
          .filter((conv: any) => {
            console.log(
              `Comparing conv.chatbotId (${conv.chatbotId}) === agentId (${agentId})`
            );
            return conv.chatbotId === agentId;
          })
          .map((conv: any) => {
            // Create a title from the first message if available
            const firstMessage =
              conv.messages && conv.messages.length > 0
                ? conv.messages[0].content.substring(0, 30) + "..."
                : `Chat ${new Date(conv.createdAt).toLocaleDateString()}`;

            return {
              id: conv.id,
              title: conv.title || firstMessage,
              createdAt: conv.createdAt,
              updatedAt: conv.updatedAt,
            };
          })
          .sort(
            (a: Conversation, b: Conversation) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );

        console.log(
          "Filtered conversations for this chatbot:",
          chatbotConversations
        );
        setConversations(chatbotConversations);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  // Load messages for a specific conversation
  const loadConversationMessages = async (convId: string) => {
    try {
      setIsLoading(true);
      console.log(`Loading messages for conversation: ${convId}`);
      const response = await conversationAPI.getMessages(convId);

      console.log("Messages response:", response);

      if (response.success && response.data) {
        const loadedMessages = response.data.map((msg: any) => ({
          id: msg.id,
          role: msg.role === "HUMAN" ? "user" : "bot",
          content: msg.content,
        }));

        console.log(
          `Loaded ${loadedMessages.length} messages:`,
          loadedMessages
        );
        setMessages(loadedMessages);
        setConversationId(convId);
      }
    } catch (error) {
      console.error("Error loading conversation messages:", error);
      setError("Failed to load conversation");
    } finally {
      setIsLoading(false);
    }
  };

  // Start a new chat
  const handleNewChat = () => {
    setConversationId(undefined);
    setMessages([
      {
        id: "welcome",
        role: "bot",
        content: chatbotStatus.ready
          ? `Hi! I'm ready to help. I have been trained on ${chatbotStatus.documentCount} document chunks. What can I help you with?`
          : "Hi! I'm not fully trained yet. Please upload some documents to get started.",
      },
    ]);
    setError(null);
  };

  // Delete a conversation
  const handleDeleteConversation = async (
    convId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this conversation?")) {
      return;
    }

    try {
      await conversationAPI.delete(convId);

      // If we're currently viewing this conversation, start a new chat
      if (conversationId === convId) {
        handleNewChat();
      }

      // Reload conversations list
      await loadConversations();
    } catch (error) {
      console.error("Error deleting conversation:", error);
      alert("Failed to delete conversation");
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    if (!chatbotStatus.ready) {
      setError("Please upload documents before chatting");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatAPI.query(agentId, input, conversationId, {
        systemPrompt: systemPrompt || undefined,
      });

      if (response.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: response.data.answer,
          sources: response.data.sources,
        };

        setMessages((prev) => [...prev, botMessage]);

        // Save conversation ID for future messages
        if (response.data.conversationId) {
          const newConvId = response.data.conversationId;

          // If this is a new conversation, reload the conversations list
          if (!conversationId) {
            await loadConversations();
          }

          setConversationId(newConvId);
        }
      } else {
        throw new Error(response.message || "Failed to get response");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = handleAPIError(error);
      setError(errorMessage);

      const errorBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: `Sorry, I encountered an error: ${errorMessage}`,
      };
      setMessages((prev) => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    if (isCheckingStatus) return "bg-yellow-500";
    if (chatbotStatus.ready) return "bg-green-500";
    return "bg-red-500";
  };

  const getStatusText = () => {
    if (isCheckingStatus) return "Checking...";
    if (chatbotStatus.ready) return "Ready";
    if (chatbotStatus.exists) return "No documents";
    return "Not found";
  };

  return (
    <div className="flex h-screen gap-6 p-6">
      {/* Conversations Sidebar */}
      <div className="w-64 bg-card rounded-lg border border-border overflow-hidden flex flex-col">
        {/* New Chat Button */}
        <div className="p-4 border-b border-border">
          <Button onClick={handleNewChat} className="w-full" variant="default">
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            Chat History
          </h3>

          {isLoadingConversations ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin" size={20} />
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No conversations yet
            </p>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => loadConversationMessages(conv.id)}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors group relative ${
                    conversationId === conv.id ? "bg-accent" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {conv.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(conv.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="w-64 bg-card rounded-lg border border-border p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Agent Status */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="text-sm text-muted-foreground">Agent status:</div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${getStatusColor()}`}
                ></div>
                <span className="text-sm font-medium">{getStatusText()}</span>
              </div>
            </div>
            {chatbotStatus.ready && (
              <p className="text-xs text-muted-foreground mb-3">
                {chatbotStatus.documentCount} document chunks loaded
              </p>
            )}
            <Button
              className="w-full"
              onClick={saveSystemPrompt}
              disabled={isSavingPrompt}
            >
              {isSavingPrompt ? "Saving..." : "Save to agent"}
            </Button>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="font-semibold mb-3">Instructions (System prompt)</h3>
            <select className="w-full border border-border rounded-lg p-2 bg-background text-sm mb-3">
              <option>Base Instructions</option>
            </select>
            <textarea
              className="w-full border border-border rounded-lg p-3 bg-background text-sm min-h-64 resize-none"
              placeholder="### Role..."
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 bg-card rounded-lg border border-border flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="border-b border-border p-6 bg-gradient-to-r from-amber-400 to-orange-400">
          <h2 className="text-xl font-semibold text-black text-balance">
            How can we help you today?
          </h2>
          {conversationId && (
            <p className="text-sm text-black/70 mt-1">
              Conversation ID: {conversationId.substring(0, 8)}...
            </p>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4"
            role="alert"
          >
            <div className="flex items-center gap-2">
              <AlertCircle size={20} />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isCheckingStatus ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin" size={40} />
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground border border-border"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>

                    {/* Show sources if available */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-xs font-semibold mb-2 opacity-75">
                          Sources:
                        </p>
                        <div className="space-y-1">
                          {message.sources.map((source, idx) => (
                            <div key={idx} className="text-xs opacity-75">
                              📄 {source.metadata.sourceFile || "Unknown"}
                              {source.metadata.chunkIndex !== undefined &&
                                ` (chunk ${source.metadata.chunkIndex})`}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-md rounded-lg p-4 bg-muted text-foreground border border-border">
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      <p className="text-sm">Thinking...</p>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-6 bg-background">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder={
                chatbotStatus.ready ? "Message..." : "Upload documents first..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
              disabled={isLoading || !chatbotStatus.ready}
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={isLoading || !chatbotStatus.ready || !input.trim()}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Powered by RAG AI •{" "}
            {conversationId
              ? `Chat: ${conversationId.substring(0, 8)}...`
              : "New conversation"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Playground;
