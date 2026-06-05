import { BrowserRouter, Routes, Route} from "react-router-dom";  
import Home from "./pages/Home";
import MoviePage from "./pages/MoviePage";
import SearchPage from "./pages/SearchPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/movies/:id" element={<MoviePage/>} />
        <Route path="/search" element={<SearchPage/>} />
      </Routes>
    </BrowserRouter>
  )
}