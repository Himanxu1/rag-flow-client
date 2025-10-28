"use client";
import React from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const SideAction = () => {
  const handleCreateAgent = () => {};
  return (
    <aside className="w-full max-w-sm -100 p-6  ">
      <div className="space-y-6">
        {/* Header */}
        <h2 className="text-xl font-bold">Sources</h2>

        {/* Card Container */}
        <Card className="p-6 space-y-4">
          {/* Total Size Section */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-lg">Total size</span>
            <span className="font-semibold text-lg">23</span>
          </div>

          {/* Create Agent Button */}
          <Button
            onClick={handleCreateAgent}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-base font-medium rounded-lg"
          >
            Create agent
          </Button>
        </Card>
      </div>
    </aside>
  );
};

export default SideAction;
