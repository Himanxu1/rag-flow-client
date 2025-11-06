"use client";
import { Button } from "@/components/ui/button";
import { useCreateAgentStore } from "@/store/createAgentStore";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAgents } from "@/hooks/useAgents";
import { useDeleteAgents } from "@/hooks/useDeleteAgent";
import NewAgentCreate from "@/components/new-agent-create";
import SingleAgentCard from "@/components/single-agent-card";
import DeleteAgentDialog from "@/components/delete-agent-dialog";
import CreateAgentDialog from "@/components/create-agent-dialog";

type Agent = {
  id: string;
  name: string;
  model: string;
  createdAt: string;
};

const Home = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [createError, setCreateError] = useState("");
  const { setAgentName, clearAll } = useCreateAgentStore();
  const router = useRouter();

  const { data: agents, isLoading, error } = useAgents();
  const deleteAgent = useDeleteAgents();

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
    clearAll();
    setAgentName(newAgentName.trim());
    setCreateDialogOpen(false);
    setNewAgentName("");
    router.push("/create-agent");
  };

  const handleDeleteClick = (agent: Agent, e: React.MouseEvent) => {
    e.stopPropagation();
    setAgentToDelete(agent);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!agentToDelete) return;

    deleteAgent.mutate(agentToDelete.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setAgentToDelete(null);
      },
      onError: (error) => {
        console.error("Error deleting agent:", error);
        alert("Failed to delete agent. Please try again.");
      },
    });
  };

  if (!agents || agents.length === 0) {
    return <NewAgentCreate handleCreateAgent={handleCreateAgent} />;
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading agents: {error.message}</div>;

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
          {agents.map((agent: any, index: any) => (
            <SingleAgentCard
              agent={agent}
              index={index}
              handleDeleteClick={handleDeleteClick}
            />
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteAgentDialog
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        agentToDelete={agentToDelete}
        isDeleting={isDeleting}
        handleDeleteConfirm={handleDeleteConfirm}
      />

      {/* Create Agent Dialog */}
      <CreateAgentDialog
        createDialogOpen={createDialogOpen}
        setCreateDialogOpen={setCreateDialogOpen}
        setNewAgentName={setNewAgentName}
        handleCreateConfirm={handleCreateConfirm}
        createError={createError}
        newAgentName={newAgentName}
      />
    </div>
  );
};

export default Home;
