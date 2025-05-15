import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

function FilterBar({ totalResults = 0, onFilterChange, onSearch, onSort }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
    if (onFilterChange) onFilterChange(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    if (onSort) onSort(e.target.value);
  };

  return (
    <div className="container mx-auto p-4 bg-black">
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="filter-dropdown">
          <label htmlFor="filter" className="mr-2 font-medium text-white">
            Filter by:
          </label>
          <select
            id="filter"
            value={filterOption}
            onChange={handleFilterChange}
            className="border px-3 py-1.5 text-white focus:outline-none"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <form onSubmit={handleSearchSubmit} className="search-bar flex-grow">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full border px-3 py-1.5 pl-8 text-white focus:outline-none"
            />
            <button
              type="submit"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white"
            >
              <FaSearch />
            </button>
          </div>
        </form>
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
            value={sortOption}
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
  );
}

export default FilterBar;
