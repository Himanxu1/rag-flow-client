import { knowledgeBaseAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useKnowledgeBases(botId: string) {
  return useQuery({
    queryKey: ["knowledgeBases", botId],
    queryFn: () => knowledgeBaseAPI.getAll(botId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!botId, // Only run query if botId exists
  });
}
