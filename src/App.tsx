import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import Header from "./components/Header";
import NotFoundPage from "./pages/NotFoundPage";
import SearchPage from "./pages/SearchPage";
import ShowPage from "./pages/ShowPage";

function App() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  // Start new pages at the top, but let back/forward keep the browser's scroll position.
  useEffect(() => {
    if (navigationType !== "POP") window.scrollTo(0, 0);
  }, [pathname, navigationType]);

  return (
    <div className="flex flex-col bg-surface-base min-h-screen text-text-secondary">
      <Header />
      <main className="flex-1 pb-16">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="show/:showId" element={<ShowPage />} />
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
