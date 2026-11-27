import {
  DependencyList,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

interface RequestState<T> {
  data: T | null;
  isLoading: boolean;
  hasError: boolean;
}

export function useRequest<T>(fetcher: () => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<RequestState<T>>({
    data: null,
    isLoading: true,
    hasError: false,
  });
  const latestCall = useRef(0);
  const isMounted = useRef(true);

  const load = useCallback(async () => {
    const call = ++latestCall.current;
    setState(previous => ({ ...previous, isLoading: true, hasError: false }));

    try {
      const data = await fetcher();
      if (isMounted.current && call === latestCall.current) {
        setState({ data, isLoading: false, hasError: false });
      }
    } catch {
      if (isMounted.current && call === latestCall.current) {
        setState({ data: null, isLoading: false, hasError: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    isMounted.current = true;
    load();
    return () => {
      isMounted.current = false;
    };
  }, [load]);

  return { ...state, reload: load };
}
