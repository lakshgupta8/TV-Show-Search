import type { Action, PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import { all, call, debounce, delay, put, select, takeEvery } from "redux-saga/effects";
import { api, NotFoundError, RateLimitError, type Endpoint } from "../api";
import { errorMessage } from "../utils";
import type { RootState } from "./index";
import { queryFailed, queryRequested, querySucceeded, type QueryEntry, type QueryRequest } from "./queriesSlice";

// Search-as-you-type endpoints wait for the user to pause before hitting the API.
const DEBOUNCED: Endpoint[] = ["searchShows", "searchPeople"];
const MAX_RATE_LIMIT_RETRIES = 3;

const inFlight = new Set<string>();

function* fetchQuery(action: PayloadAction<QueryRequest>): SagaIterator {
  const { key, endpoint, arg } = action.payload;
  if (inFlight.has(key)) return;

  const entry: QueryEntry | undefined = yield select((state: RootState) => state.queries[key]);
  if (entry?.status === "succeeded") return;

  inFlight.add(key);
  try {
    const fetcher = api[endpoint] as (arg: unknown) => Promise<unknown>;
    for (let attempt = 0; ; attempt++) {
      try {
        const data: unknown = yield call(fetcher, arg);
        yield put(querySucceeded({ key, data }));
        return;
      } catch (error) {
        // TVmaze allows ~20 requests per 10 seconds; back off and retry when we hit the limit.
        if (error instanceof RateLimitError && attempt < MAX_RATE_LIMIT_RETRIES) {
          yield delay(1500 * (attempt + 1));
          continue;
        }
        throw error;
      }
    }
  } catch (error) {
    yield put(
      queryFailed({ key, error: errorMessage(error), notFound: error instanceof NotFoundError })
    );
  } finally {
    inFlight.delete(key);
  }
}

const isRequestFor = (endpoint: Endpoint) => (action: Action) =>
  queryRequested.match(action) && action.payload.endpoint === endpoint;

const isImmediateRequest = (action: Action) =>
  queryRequested.match(action) && !DEBOUNCED.includes(action.payload.endpoint);

export function* rootSaga(): SagaIterator {
  yield all([
    ...DEBOUNCED.map((endpoint) => debounce(300, isRequestFor(endpoint), fetchQuery)),
    takeEvery(isImmediateRequest, fetchQuery),
  ]);
}
