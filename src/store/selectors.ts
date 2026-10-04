import { createSelector } from "@reduxjs/toolkit";
import type { Show } from "../types";
import type { RootState } from "./index";
import { showsAdapter } from "./showsSlice";

const EMPTY: Show[] = [];

export const { selectById: selectShowById, selectEntities: selectShowEntities } =
  showsAdapter.getSelectors((state: RootState) => state.shows);

export const selectSearchEntry = (state: RootState, query: string) =>
  state.shows.searches[query];

export const selectDetailEntry = (state: RootState, id: number) =>
  state.shows.details[id];

export const selectSearchResults = createSelector(
  [selectShowEntities, selectSearchEntry],
  (entities, entry) => (entry ? entry.ids.map((id) => entities[id]) : EMPTY)
);
