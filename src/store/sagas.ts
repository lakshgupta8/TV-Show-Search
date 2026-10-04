import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import { all, call, debounce, put, select, takeEvery } from "redux-saga/effects";
import { fetchShow, NotFoundError, searchShows } from "../api";
import type { Show } from "../types";
import { errorMessage } from "../utils";
import { selectDetailEntry, selectSearchEntry } from "./selectors";
import {
  detailFailed,
  detailRequested,
  detailSucceeded,
  searchFailed,
  searchRequested,
  searchSucceeded,
  type DetailEntry,
  type SearchEntry,
} from "./showsSlice";

function* searchSaga(action: PayloadAction<string>): SagaIterator {
  const query = action.payload;
  const entry: SearchEntry | undefined = yield select(selectSearchEntry, query);
  if (entry?.status === "succeeded") return;

  try {
    const shows: Show[] = yield call(searchShows, query);
    yield put(searchSucceeded({ query, shows }));
  } catch (error) {
    yield put(searchFailed({ query, error: errorMessage(error) }));
  }
}

function* detailSaga(action: PayloadAction<number>): SagaIterator {
  const id = action.payload;
  const entry: DetailEntry | undefined = yield select(selectDetailEntry, id);
  if (entry?.status === "succeeded") return;

  try {
    const result: Awaited<ReturnType<typeof fetchShow>> = yield call(fetchShow, id);
    yield put(detailSucceeded(result));
  } catch (error) {
    yield put(
      detailFailed({
        id,
        error: errorMessage(error),
        notFound: error instanceof NotFoundError,
      })
    );
  }
}

export function* rootSaga(): SagaIterator {
  yield all([
    debounce(300, searchRequested.type, searchSaga),
    takeEvery(detailRequested.type, detailSaga),
  ]);
}
