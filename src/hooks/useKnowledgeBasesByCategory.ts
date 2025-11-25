import { knowledgeBaseAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useKnowledgeBasesByCategory(
  botId: string,
  category: string
) {
  return useQuery({
    queryKey: ["knowledgeBases", botId, category],
    queryFn: () => knowledgeBaseAPI.getByCategory(botId, category),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!botId && !!category, // Only run query if both exist
  });
}
