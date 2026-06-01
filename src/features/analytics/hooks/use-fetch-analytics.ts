import { useState, useEffect } from "react";

type FetchState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

export function useFetchAnalytics<T>(endpoint: string, range: string, admin: boolean = false) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const url = new URL(endpoint, window.location.origin);
        url.searchParams.set("range", range);
        if (admin) url.searchParams.set("admin", "true");

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Failed to fetch analytics");
        
        const json = await res.json();
        
        if (isMounted) {
          if (json.ok) {
            setState({ data: json.data || json, isLoading: false, error: null });
          } else {
            setState({ data: null, isLoading: false, error: json.error || "Unknown error" });
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          setState({ data: null, isLoading: false, error: err instanceof Error ? err.message : "Error fetching data" });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [endpoint, range, admin]);

  return state;
}
