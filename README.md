# TV SHOWS Discovery App

A show discovery application built with a focus on robust state management. Designed with a sleek **Gray-Amber** aesthetic.

## Features

- **Home**: What's airing on US TV tonight, what's new on streaming today, the top-rated shows in the catalog, and a genre directory.
- **Search**: Debounced, search-as-you-type for both **shows** and **people**. The query lives in the URL (`/search?q=...&type=people`), so refreshes, shared links and the back button all restore your results.
- **Browse**: Explore the full TVmaze catalog with genre, status and language filters, sorted by popularity, rating, release date or name. More of the catalog loads on demand.
- **Schedule**: Every episode airing on TV (by country) or released on streaming services, for any day, grouped by air time and filterable by show or network.
- **Show Pages** with tabs:
  - **Overview**: summary, next and latest episodes, starring cast, seasons, show info and alternate titles from around the world.
  - **Episodes**: season picker, every episode with stills, air dates, ratings and a season average.
  - **Cast & Crew**: the full cast with characters, and the crew grouped by role.
  - **Gallery**: posters, backgrounds, banners and logos with a keyboard-friendly lightbox.
- **Episode Pages**: still, summary, rating, guest stars, episode crew and previous/next navigation.
- **Person Pages**: bio facts (born, died, age, country) and full acting and behind-the-camera filmographies.
- **Cast Visualization**:
  - **Avatar Stacks**: Overlapping circular avatars that link to each person, with initials as a fallback when there is no photo.
  - **Interactive Popover**: The "+N" indicator reveals the full cast list without shifting the page (closes on outside click or `Esc`).
  - **Tooltips**: Actor and character names on hover or keyboard focus.
- **Polished States**: Skeleton loaders, previous results kept visible while new ones load, retryable errors, and a 404 page.
- **Keyboard Friendly**: Press `/` anywhere to focus search and `Esc` to clear it.
- **Centralized Design System**: Color palette defined once as Tailwind CSS `@theme` tokens in `src/index.css`.

## How data loading works

Every TVmaze request goes through one Redux slice, `queries`, that caches responses by endpoint + argument. Components call `useQuery("showDetails", id)`, which dispatches `queryRequested`; a saga then:

- skips the request if the response is already cached or in flight,
- **debounces** search endpoints by 300 ms so typing doesn't spam the API,
- **retries with backoff** when TVmaze's rate limit (~20 requests / 10 s) is hit,
- stores the result with `querySucceeded` / `queryFailed`.

Show pages use a single request with embedded cast, crew, seasons, episodes, images, alternate titles and next/previous episode, and every show tab reads from that one cached response.

## Tech Stack

- **Core**: React 18, TypeScript, Vite
- **State Management**: Redux Toolkit (`createSlice`, `createEntityAdapter`, `createSelector`) + Redux Saga for async side effects
- **Routing**: React Router
- **Styling**: Tailwind CSS v4 (with custom `@theme` tokens)
- **Parsing**: `html-react-parser` for HTML summaries
- **API**: [TVMaze API](https://www.tvmaze.com/api)

## Project Architecture

```bash
src/
├── components/     # Reusable UI (SearchBar, ShowCard, PersonCard, EpisodeRow, CastStack, Rail, Lightbox, ...)
├── pages/
│   ├── HomePage, SearchPage, BrowsePage, SchedulePage, EpisodePage, PersonPage, NotFoundPage
│   └── show/           # ShowLayout (hero + tabs) and the Overview, Episodes, Cast, Gallery tabs
├── store/
│   ├── index.ts        # Store setup + typed hooks
│   ├── queriesSlice.ts # Response cache keyed by endpoint + argument
│   ├── sagas.ts        # Fetching, debouncing, de-duplication, rate-limit retries
│   └── useQuery.ts     # useQuery / useQueries hooks
├── api.ts          # TVmaze client: every endpoint the app uses
├── constants.ts    # Genres, countries, shared classes
├── types.ts        # Shared TypeScript types
├── utils.ts        # Formatting helpers
└── index.css       # Global styles and design-system tokens
```

## Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- [Bun](https://bun.sh/) or npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/lakshgupta8/CodeYogi-TV-Shows-Application.git
   ```

2. Install dependencies:

   ```bash
   bun install
   # or
   npm install
   ```

3. Fire up the development server:

   ```bash
   bun dev
   ```

4. Build for production:

   ```bash
   bun run build
   ```

---

Developed as part of the Advanced **CodeYogi** Course.
