"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useCreateAgentStore } from "@/store/createAgentStore";
import { chatbotAPI, handleAPIError } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCreateAgent } from "@/hooks/useCreateAgent";

const SideAction = () => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const { agentName, uploadedFiles, clearAll } = useCreateAgentStore();
  const createAgent = useCreateAgent();

  const handleCreateAgent = async () => {
    if (uploadedFiles.length === 0) {
      alert(
        "Please upload at least one knowledge base before creating the agent"
      );
      return;
    }

    setIsCreating(true);

    createAgent.mutate(agentName, {
      onSuccess: async (data) => {
        const { chatbot } = data;
        const uploadPromises = uploadedFiles.map(async (uploadedFile) => {
          if (uploadedFile.type === "FILE" && uploadedFile.file) {
            return chatbotAPI.uploadFile(chatbot.id, uploadedFile.file);
          } else if (uploadedFile.type === "TEXT" && uploadedFile.content) {
            return chatbotAPI.uploadText(
              chatbot.id,
              uploadedFile.content,
              uploadedFile.name
            );
          } else if (uploadedFile.type === "WEBSITE" && uploadedFile.url) {
            return chatbotAPI.uploadWebsite(
              chatbot.id,
              uploadedFile.url,
              uploadedFile.name
            );
          }
        });
        await Promise.all(uploadPromises);

        clearAll();
        localStorage.setItem("botId", chatbot.id);
        router.push(`/agents/${chatbot.id}/playground`);
      },
      onError: (error) => {
        console.error("Error creating agent:", error);
        const errorMessage = handleAPIError(error);
        alert(`Failed to create agent: ${errorMessage}`);
      },
      onSettled: () => {
        setIsCreating(false);
      },
    });
  };

  return (
    <aside className="w-full max-w-sm p-6">
      <div className="space-y-6">
        {/* Header */}
        <h2 className="text-xl font-bold">Sources</h2>

        {/* Card Container */}
        <Card className="p-6 space-y-4">
          {/* Total Size Section */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-lg">Total files</span>
            <span className="font-semibold text-lg">
              {uploadedFiles.length}
            </span>
          </div>

          {/* Create Agent Button */}
          <Button
            onClick={handleCreateAgent}
            disabled={isCreating || uploadedFiles.length === 0}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-6 text-base font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating agent...
              </>
            ) : (
              "Create agent"
            )}
          </Button>
        </Card>
      </div>
    </aside>
  );
};

export default SideAction;
