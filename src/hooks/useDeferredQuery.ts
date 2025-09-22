import { useQuery } from "@tanstack/react-query";

// Create a deferred hook that delays execution to avoid blocking critical requests
export const useDeferredQuery = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  delay: number = 1000,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  }
) => {
  const { enabled = true, staleTime = 5 * 60 * 1000, gcTime = 30 * 60 * 1000 } = options || {};
  
  return useQuery({
    queryKey,
    queryFn,
    enabled: enabled && typeof window !== 'undefined',
    staleTime,
    gcTime,
    // Defer execution to avoid blocking critical rendering path
    initialData: undefined,
    // Lower network priority
    networkMode: 'online' as const,
  });
};