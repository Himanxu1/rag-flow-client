import { conversationAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useConversationMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: ["conversations", conversationId, "messages"],
    queryFn: () => conversationAPI.getMessages(conversationId!),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!conversationId, // Only run query if conversationId exists
  });
}
