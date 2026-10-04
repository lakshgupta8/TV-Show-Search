import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Endpoint } from "../api";

export interface QueryEntry {
  status: "loading" | "succeeded" | "failed";
  data?: unknown;
  error?: string;
  notFound?: boolean;
}

export interface QueryRequest {
  key: string;
  endpoint: Endpoint;
  arg: unknown;
  // Refetch even when a successful response is already cached.
  force?: boolean;
}

// Every API response is cached here under a key built from its endpoint and argument,
// so revisiting a page or a search is instant.
const queriesSlice = createSlice({
  name: "queries",
  initialState: {} as Record<string, QueryEntry>,
  reducers: {
    queryRequested(state, action: PayloadAction<QueryRequest>) {
      const { key, force } = action.payload;
      const entry = state[key];
      if (entry?.status === "loading") return;
      if (entry?.status === "succeeded" && !force) return;
      state[key] = { status: "loading", data: entry?.data };
    },
    querySucceeded(state, action: PayloadAction<{ key: string; data: unknown }>) {
      const { key, data } = action.payload;
      state[key] = { status: "succeeded", data };
    },
    queryFailed(state, action: PayloadAction<{ key: string; error: string; notFound: boolean }>) {
      const { key, error, notFound } = action.payload;
      state[key] = { status: "failed", data: state[key]?.data, error, notFound };
    },
  },
});

export const { queryRequested, querySucceeded, queryFailed } = queriesSlice.actions;

export default queriesSlice.reducer;
