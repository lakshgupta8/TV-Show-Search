import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import Header from "./components/Header";
import BrowsePage from "./pages/BrowsePage";
import EpisodePage from "./pages/EpisodePage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import PersonPage from "./pages/PersonPage";
import SchedulePage from "./pages/SchedulePage";
import SearchPage from "./pages/SearchPage";
import ShowCast from "./pages/show/ShowCast";
import ShowEpisodes from "./pages/show/ShowEpisodes";
import ShowGallery from "./pages/show/ShowGallery";
import ShowLayout from "./pages/show/ShowLayout";
import ShowOverview from "./pages/show/ShowOverview";

function App() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  // Switching tabs on a show page stays on the same "page", so it shouldn't jump to the top.
  const pageKey = pathname.replace(/^(\/show\/\d+).*/, "$1");

  // Start new pages at the top, but let back/forward keep the browser's scroll position.
  useEffect(() => {
    if (navigationType !== "POP") window.scrollTo(0, 0);
  }, [pageKey, navigationType]);

  return (
    <div className="flex flex-col bg-surface-base min-h-screen text-text-secondary">
      <Header />
      <main className="flex-1 pb-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="browse" element={<BrowsePage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="show/:showId" element={<ShowLayout />}>
            <Route index element={<ShowOverview />} />
            <Route path="episodes" element={<ShowEpisodes />} />
            <Route path="cast" element={<ShowCast />} />
            <Route path="gallery" element={<ShowGallery />} />
          </Route>
          <Route path="episode/:episodeId" element={<EpisodePage />} />
          <Route path="person/:personId" element={<PersonPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="py-6 border-t border-border-base text-text-muted text-xs text-center">
        Built for the CodeYogi course · Show data from{" "}
        <a href="https://www.tvmaze.com" target="_blank" rel="noreferrer" className="hover:text-accent-text underline underline-offset-2">
          TVmaze
        </a>
      </footer>
    </div>
  );
}

export default App;
