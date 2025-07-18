import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: true, // Always refetch on focus
      staleTime: 0, // Always consider data stale
      gcTime: 0, // Don't cache data
      retry: 2,
    },
    mutations: {
      retry: false,
    },
  },
});
