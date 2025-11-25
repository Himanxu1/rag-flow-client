import { chatAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useChatStatus(agentId: string) {
  return useQuery({
    queryKey: ["chatStatus", agentId],
    queryFn: () => chatAPI.getStatus(agentId),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!agentId, // Only run query if agentId exists
  });
}
