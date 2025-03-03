import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    if (city.trim() !== "") {
      onSearch(city);
    }
  };

  return (
    <div className="flex items-center justify-center mt-8">
      <input
        type="text"
        className="p-2 w-80 border border-gray-300 rounded-l-lg outline-none"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-r-lg flex items-center"
        onClick={handleSearch}
      >
        <FaSearch className="mr-2" /> Search
      </button>
    </div>
  );
};

export default SearchBar;
