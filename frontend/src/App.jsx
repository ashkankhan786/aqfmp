import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import SearchResults from "./Components/SearchResults";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/searchresults" element={<SearchResults/>} />
      </Routes>
    </Router>
  );
}

export default App;
