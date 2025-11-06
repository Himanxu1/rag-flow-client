"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Clock } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

type Chatbot = {
  id: string;
  name: string;
  model: string;
  createdAt: string;
};

interface ChatbotsListProps {
  chatbots: Chatbot[];
}

const ChatbotsList: React.FC<ChatbotsListProps> = ({ chatbots }) => {
  if (!chatbots || chatbots.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No chatbots created yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {chatbots.map((bot, index) => (
        <motion.div
          key={bot.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" /> {bot.name}
              </CardTitle>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                {bot.model.toUpperCase()}
              </span>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Clock className="w-4 h-4" />
                Created: {new Date(bot.createdAt).toLocaleString()}
              </div>
              <Button variant="outline" className="w-full">
                Open Chatbot
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ChatbotsList;
