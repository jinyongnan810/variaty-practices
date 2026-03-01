import { useState } from "react";
import { Routes, Route } from "react-router";
import Header from "./components/Header";
import Gallery from "./pages/Gallery";
import TrickDetail from "./pages/TrickDetail";

export type Category = "All" | "CSS" | "JS" | "React";

function App() {
  const [filter, setFilter] = useState<Category>("All");

  return (
    <div className="min-h-screen bg-page">
      <Header filter={filter} onFilterChange={setFilter} />
      <Routes>
        <Route path="/" element={<Gallery filter={filter} />} />
        <Route path="/trick/:id" element={<TrickDetail />} />
      </Routes>
    </div>
  );
}

export default App;
