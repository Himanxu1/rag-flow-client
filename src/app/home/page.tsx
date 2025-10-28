"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Home = () => {
  const navigator = useRouter();
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-2xl px-6 mt-10">
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            No agents yet..
          </h2>
          <p className="text-center text-muted-foreground mb-8 max-w-md">
            Create your first AI Agent to start automating support, generating
            leads, and answering customer questions
          </p>

          <Button
            size="lg"
            className="gap-2 cursor-pointer"
            onClick={() => navigator.push("/create-agent")}
          >
            <Plus className="w-5 h-5" />
            New AI agent
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
