import { settingsAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useSettings(agentId: string) {
  return useQuery({
    queryKey: ["settings", agentId],
    queryFn: () => settingsAPI.get(agentId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!agentId, // Only run query if agentId exists
  });
}
