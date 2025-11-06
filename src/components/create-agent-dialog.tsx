import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";
import { Button } from "./ui/button";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";

const CreateAgentDialog = ({
  createDialogOpen,
  setCreateDialogOpen,
  setNewAgentName,
  handleCreateConfirm,
  createError,
  newAgentName,
}: {
  createDialogOpen: any;
  setCreateDialogOpen: any;
  setNewAgentName: any;
  handleCreateConfirm: any;
  createError: any;
  newAgentName: any;
}) => {
  return (
    <div>
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Agent</DialogTitle>
            <DialogDescription>
              Enter a name for your new AI agent. You can add knowledge base
              content after creation.
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

export default CreateAgentDialog;
