// Preserve the existing read-hook interface while sharing the request lifecycle.
import useApiData from './useApiData';
const useApiWithReducer = <T>(key: string, request: (signal: AbortSignal) => Promise<T>) => {
  const { fetchData, ...state } = useApiData(key, request);
  return { ...state, refetch: fetchData };
};
export default useApiWithReducer;
