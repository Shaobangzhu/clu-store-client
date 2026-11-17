import { useState, useEffect, useRef, useCallback } from 'react';

type ApiRequest<T> = (signal: AbortSignal) => Promise<T>;
// Retains the existing data/loading/error/refetch interface, with typed service calls.
const useApiData = <T>(key: string, request: ApiRequest<T>, { autoFetch = true, scope }: { autoFetch?: boolean; scope?: string | null } = {}) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef(request);
  requestRef.current = request;
  const active = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (override?: ApiRequest<T>) => {
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    setLoading(true);
    setError(null);
    try {
      const result = await (override ?? requestRef.current)(controller.signal);
      if (!controller.signal.aborted) setData(result);
      return result;
    } catch (failure) {
      if (!controller.signal.aborted) {
        setData(null);
        setError(failure instanceof Error ? failure.message : 'Request failed');
      }
      throw failure;
    } finally {
      if (active.current === controller) {
        active.current = null;
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    setData(null);
    setError(null);
    if (autoFetch) void fetchData().catch(() => { /* State contains the request error. */ });
    return () => {
      active.current?.abort();
      active.current = null;
    };
  }, [key, scope, autoFetch, fetchData]);
  return { data, loading, error, fetchData };
};
export default useApiData;
