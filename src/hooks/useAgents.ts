import { chatAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useAgents() {
  return useQuery({
    queryKey: ["agents"],
    queryFn: () => chatAPI.getAllChatbats(),
    staleTime: 5 * 60 * 1000,
  });
}
