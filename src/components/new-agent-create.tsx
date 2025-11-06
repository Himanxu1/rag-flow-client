import React from "react";
import { Button } from "./ui/button";
import { Plus, Sparkles } from "lucide-react";

const NewAgentCreate = ({ handleCreateAgent }: { handleCreateAgent: any }) => {
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
};

export default NewAgentCreate;
