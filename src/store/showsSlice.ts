import { createEntityAdapter, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Show, ShowExtras, Status } from "../types";

export interface SearchEntry {
  status: Status;
  ids: number[];
  error?: string;
}

export interface DetailEntry extends ShowExtras {
  status: Status;
  error?: string;
  notFound?: boolean;
}

export const showsAdapter = createEntityAdapter<Show>();

const initialState = showsAdapter.getInitialState({
  // Search results keyed by normalized query, so revisiting a query is instant.
  searches: {} as Record<string, SearchEntry>,
  // Cast and seasons keyed by show id, loaded on the details page.
  details: {} as Record<number, DetailEntry>,
});

const showsSlice = createSlice({
  name: "shows",
  initialState,
  reducers: {
    searchRequested(state, action: PayloadAction<string>) {
      const entry = state.searches[action.payload];
      if (entry?.status === "succeeded") return;
      state.searches[action.payload] = { status: "loading", ids: [] };
    },
    searchSucceeded(state, action: PayloadAction<{ query: string; shows: Show[] }>) {
      const { query, shows } = action.payload;
      showsAdapter.upsertMany(state, shows);
      state.searches[query] = { status: "succeeded", ids: shows.map((show) => show.id) };
    },
    searchFailed(state, action: PayloadAction<{ query: string; error: string }>) {
      const { query, error } = action.payload;
      state.searches[query] = { status: "failed", ids: [], error };
    },
    detailRequested(state, action: PayloadAction<number>) {
      const entry = state.details[action.payload];
      if (entry?.status === "succeeded") return;
      state.details[action.payload] = { status: "loading", cast: [], seasons: [] };
    },
    detailSucceeded(state, action: PayloadAction<{ show: Show; extras: ShowExtras }>) {
      const { show, extras } = action.payload;
      showsAdapter.upsertOne(state, show);
      state.details[show.id] = { status: "succeeded", ...extras };
    },
    detailFailed(
      state,
      action: PayloadAction<{ id: number; error: string; notFound: boolean }>
    ) {
      const { id, error, notFound } = action.payload;
      state.details[id] = { status: "failed", cast: [], seasons: [], error, notFound };
    },
  },
});

export const {
  searchRequested,
  searchSucceeded,
  searchFailed,
  detailRequested,
  detailSucceeded,
  detailFailed,
} = showsSlice.actions;

export default showsSlice.reducer;
