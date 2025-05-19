import React, { useState, useEffect, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import AppearOnScroll from "../../components/AppearOnScroll";

function FilterBar({
  totalResults = 0,
  onFilterChange,
  onSearch,
  onSort,
  searchQuery = "",
}) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setLocalSearchQuery(query);
  };

  // Debounce search with useEffect
  const debouncedSearch = useCallback(() => {
    if (onSearch) onSearch(localSearchQuery);
  }, [localSearchQuery, onSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch();
    }, 500); // 500ms delay after user stops typing

    return () => clearTimeout(timer);
  }, [debouncedSearch]);

  const handleSortChange = (e) => {
    if (onSort) onSort(e.target.value);
  };

  return (
    <AppearOnScroll>
      <div className="container mx-auto p-4 bg-black">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="search-bar flex-grow">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={localSearchQuery}
                onChange={handleSearchChange}
                className="w-full border px-3 py-1.5 pl-8 text-white focus:outline-none"
              />
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white">
                <FaSearch />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center">
          <div className="results-count">
            <p className="text-white">{totalResults} results found</p>
          </div>

          <div className="sort-dropdown">
            <label htmlFor="sort" className="mr-2 font-medium text-white">
              Sort by:
            </label>
            <select
              id="sort"
              onChange={handleSortChange}
              className="border px-3 py-1.5 text-white focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
            </select>
          </div>
        </div>
      </div>
    </AppearOnScroll>
  );
}

export default React.memo(FilterBar);
