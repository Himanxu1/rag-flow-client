import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import React from "react";
import { AlertDialogFooter, AlertDialogHeader } from "./ui/alert-dialog";

const DeleteAgentDialog = ({
  deleteDialogOpen,
  setDeleteDialogOpen,
  agentToDelete,
  isDeleting,
  handleDeleteConfirm,
}: {
  deleteDialogOpen: any;
  setDeleteDialogOpen: any;
  agentToDelete: any;
  isDeleting: any;
  handleDeleteConfirm: any;
}) => {
  return (
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
  );
};

export default DeleteAgentDialog;
