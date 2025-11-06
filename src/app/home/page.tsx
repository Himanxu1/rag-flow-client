"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { useCreateAgentStore } from "@/store/createAgentStore";
import axios from "axios";
import { Plus, Bot, Clock, Sparkles, MoreVertical, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { chatbotAPI } from "@/lib/api";

type Agent = {
  id: string;
  name: string;
  model: string;
  createdAt: string;
};

const Home = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [createError, setCreateError] = useState("");
  const { token } = useAuthStore();
  const { setAgentName, clearAll } = useCreateAgentStore();
  const router = useRouter();

  const handleCreateAgent = () => {
    setNewAgentName("");
    setCreateError("");
    setCreateDialogOpen(true);
  };

  const handleCreateConfirm = () => {
    if (!newAgentName.trim()) {
      setCreateError("Agent name is required");
      return;
    }

    // Clear any previous data and set the new agent name
    clearAll();
    setAgentName(newAgentName.trim());
    setCreateDialogOpen(false);
    setNewAgentName("");
    // Navigate to create-agent page with the name stored
    router.push("/create-agent");
  };

  const fetchAllAgents = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3001/api/v1/chatbot/get-chatbots",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAgents(data.chatbots);
    } catch (err) {
      console.error("Error fetching agents:", err);
    }
  };

  useEffect(() => {
    fetchAllAgents();
  }, []);

  const handleDeleteClick = (agent: Agent, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setAgentToDelete(agent);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!agentToDelete) return;

    setIsDeleting(true);
    try {
      await chatbotAPI.delete(agentToDelete.id);
      // Remove from local state
      setAgents((prev) => prev.filter((a) => a.id !== agentToDelete.id));
      setDeleteDialogOpen(false);
      setAgentToDelete(null);
    } catch (error) {
      console.error("Error deleting agent:", error);
      alert("Failed to delete agent. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // 🟡 Empty state when no agents exist
  if (!agents || agents.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-purple-50/30 dark:to-purple-950/10">
        <div className="w-full max-w-2xl px-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-6 shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-3">
              No agents yet
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-md text-lg">
              Create your first AI Agent to start automating support, generating
              leads, and answering customer questions
            </p>

            <Button
              size="lg"
              className="gap-2 cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all"
              onClick={handleCreateAgent}
            >
              <Plus className="w-5 h-5" />
              Create Your First Agent
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8 w-[1000px]">
      <div className="w-full ">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">My AI Agents</h1>
          <Button
            className="gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            onClick={handleCreateAgent}
          >
            <Plus className="w-4 h-4" /> New Agent
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="w-full"
            >
              <Card
                className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer relative group border-border/50 bg-card overflow-hidden"
                onClick={() => {
                  localStorage.setItem("botId", agent.id);
                  router.push(`/agents/${agent.id}/playground`);
                }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardHeader className="pb-3 relative z-10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-md">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold truncate mb-1">
                          {agent.name}
                        </CardTitle>
                        <span className="inline-flex items-center text-xs font-medium text-muted-foreground bg-muted/80 px-2.5 py-1 rounded-full">
                          {agent.model.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 cursor-pointer"
                          onClick={(e) => handleDeleteClick(agent, e)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Agent
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 relative z-10">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">
                      {new Date(agent.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                  >
                    Open Agent
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Agent</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{agentToDelete?.name}"? This will
              permanently delete the agent and all associated data including:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Knowledge base documents</li>
                <li>Conversation history</li>
                <li>Analytics data</li>
                <li>Settings and configurations</li>
              </ul>
              <p className="mt-2 font-semibold text-red-600">
                This action cannot be undone.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete Agent"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Agent Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Agent</DialogTitle>
            <DialogDescription>
              Enter a name for your new AI agent. You can add knowledge base content after creation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="agent-name">Agent Name</Label>
              <Input
                id="agent-name"
                placeholder="e.g., Customer Support Bot"
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateConfirm();
                  }
                }}
                autoFocus
              />
              {createError && (
                <p className="text-sm text-red-600">{createError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateConfirm}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
