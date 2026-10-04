# TV SHOWS Discovery App

A show discovery application built with a focus on robust state management. Designed with a sleek **Gray-Amber** aesthetic.

## Features

- **Instant Search**: Debounced, real-time show discovery powered by the TVMaze API. Results are cached per query, and the query lives in the URL (`/?q=...`), so refreshes, shared links and the back button all restore your results.
- **Show Details**: Poster, blurred backdrop, status, years, runtime, network, genres, rating, airing schedule and a link to the official site.
- **Seasons**: Every season with its episode count and air dates.
- **Cast Visualization**:
  - **Avatar Stacks**: Overlapping circular avatars, with initials as a fallback when there is no photo.
  - **Interactive Popover**: The "+N" indicator reveals the full cast list without shifting the page (closes on outside click or `Esc`).
  - **Tooltips**: Actor and character names on hover or keyboard focus.
- **Polished States**: Skeleton loaders, previous results kept visible while new ones load, retryable errors, and a 404 page.
- **Keyboard Friendly**: Press `/` anywhere to focus search and `Esc` to clear it.
- **Centralized Design System**: Color palette defined once as Tailwind CSS `@theme` tokens in `src/index.css`.

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
├── components/     # Reusable UI (SearchBar, ShowCard, CastStack, SeasonList, ...)
├── pages/          # Screens: SearchPage, ShowPage, NotFoundPage
├── store/
│   ├── index.ts        # Store setup + typed hooks
│   ├── showsSlice.ts   # Normalized shows, per-query search cache, per-show details
│   ├── sagas.ts        # Debounced search + detail fetching
│   └── selectors.ts    # Memoized selectors
├── api.ts          # TVMaze client
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
