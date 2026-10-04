import { useCallback, useEffect, useMemo, useRef } from "react";
import { shallowEqual } from "react-redux";
import type { Endpoint, EndpointArg, EndpointData } from "../api";
import type { Status } from "../types";
import { useAppDispatch, useAppSelector } from "./index";
import { queryRequested, type QueryEntry } from "./queriesSlice";

export interface QueryResult<T> {
  data: T | undefined;
  status: Status;
  error?: string;
  notFound: boolean;
  // True while showing the previous key's data because keepPreviousData is on.
  isPreviousData: boolean;
  refetch: () => void;
}

export const queryKey = (endpoint: Endpoint, arg: unknown) => `${endpoint}:${JSON.stringify(arg)}`;

function toResult<T>(entry: QueryEntry | undefined, skipped: boolean, refetch: () => void): QueryResult<T> {
  return {
    data: entry?.data as T | undefined,
    status: skipped ? "idle" : (entry?.status ?? "loading"),
    error: entry?.error,
    notFound: entry?.notFound ?? false,
    isPreviousData: false,
    refetch,
  };
}

/**
 * Reads an endpoint's cached response and asks the sagas to fetch it when missing.
 * Pass `null` as the argument to skip the request.
 */
export function useQuery<E extends Endpoint>(
  endpoint: E,
  arg: EndpointArg<E> | null,
  options: { keepPreviousData?: boolean } = {}
): QueryResult<EndpointData<E>> {
  const dispatch = useAppDispatch();
  const key = arg === null ? null : queryKey(endpoint, arg);
  const entry = useAppSelector((state) => (key ? state.queries[key] : undefined));

  // The key fully describes the request, so it is the only dependency needed.
  const argRef = useRef(arg);
  argRef.current = arg;
  const request = useCallback(
    (force: boolean) => {
      if (key) dispatch(queryRequested({ key, endpoint, arg: argRef.current, force }));
    },
    [dispatch, key, endpoint]
  );

  useEffect(() => request(false), [request]);
  const refetch = useCallback(() => request(true), [request]);

  const result = toResult<EndpointData<E>>(entry, key === null, refetch);

  const previous = useRef<EndpointData<E> | undefined>(undefined);
  if (result.data !== undefined) previous.current = result.data;
  if (key === null) previous.current = undefined;
  if (options.keepPreviousData && result.data === undefined && previous.current !== undefined) {
    return { ...result, data: previous.current, isPreviousData: true };
  }
  return result;
}

// Same as useQuery, for a list of arguments of one endpoint (e.g. several catalog pages).
export function useQueries<E extends Endpoint>(endpoint: E, args: EndpointArg<E>[]): QueryResult<EndpointData<E>>[] {
  const dispatch = useAppDispatch();
  const keys = useMemo(() => args.map((arg) => queryKey(endpoint, arg)), [endpoint, args]);
  const entries = useAppSelector((state) => keys.map((key) => state.queries[key]), shallowEqual);

  useEffect(() => {
    keys.forEach((key, i) => dispatch(queryRequested({ key, endpoint, arg: args[i] })));
  }, [dispatch, endpoint, keys, args]);

  return entries.map((entry, i) =>
    toResult<EndpointData<E>>(entry, false, () =>
      dispatch(queryRequested({ key: keys[i], endpoint, arg: args[i], force: true }))
    )
  );
}
