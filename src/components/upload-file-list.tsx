"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2, FileText, Globe, Type } from "lucide-react";
import { useCreateAgentStore, UploadedFile } from "@/store/createAgentStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface UploadedFilesListProps {
  filterType?: "FILE" | "TEXT" | "WEBSITE";
}

const UploadedFilesList: React.FC<UploadedFilesListProps> = ({
  filterType,
}) => {
  const { uploadedFiles, removeUploadedFile } = useCreateAgentStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [fileToDelete, setFileToDelete] = React.useState<UploadedFile | null>(
    null
  );

  // Filter files by type if specified
  const filteredFiles = filterType
    ? uploadedFiles.filter((f) => f.type === filterType)
    : uploadedFiles;

  const handleDeleteClick = (file: UploadedFile) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (fileToDelete) {
      removeUploadedFile(fileToDelete.id);
      setFileToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "FILE":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "TEXT":
        return <Type className="w-5 h-5 text-green-500" />;
      case "WEBSITE":
        return <Globe className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (filteredFiles.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">
            Uploaded {filterType ? filterType.toLowerCase() + "s" : "Files"} (
            {filteredFiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(file.uploadedAt)}
                      {file.size && ` • ${formatSize(file.size)}`}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(file)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{fileToDelete?.name}"? This will
              not affect already created agents.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UploadedFilesList;
