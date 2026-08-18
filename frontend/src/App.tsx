import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MoviePage from "./pages/MoviePage";
import TvPage from "./pages/TvPage";
import SearchPage from "./pages/SearchPage";
import IntroAnimation from "./components/IntroAnimation";

export default function App() {
  const [isIntroComplete, setIsIntroComplete] = useState(() => {
    return Boolean(sessionStorage.getItem("cinefy_intro_seen"));
  });

  return (
    <div className="bg-black min-h-screen text-white" style={{ backgroundColor: "#000000" }}>
      <BrowserRouter>
        {!isIntroComplete ? (
          <IntroAnimation onComplete={() => setIsIntroComplete(true)} />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies/:id" element={<MoviePage />} />
            <Route path="/tv/:id" element={<TvPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}