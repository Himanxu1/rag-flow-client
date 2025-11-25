import { conversationAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () => conversationAPI.getAll(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
