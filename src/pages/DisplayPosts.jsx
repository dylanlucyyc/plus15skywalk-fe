import React, { useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Banner from "../components/Banner";
import FilterBar from "../features/post/FilterBar";
import Posts from "../features/post/Posts";
import Pagination from "../features/post/Pagination";
import PageTitle from "../components/PageTitle";
import {
  setCurrentPage,
  fetchPosts,
  setSearchQuery,
  setFilterOption,
  setSortOption,
  selectPostsByType,
  selectPaginationByType,
  selectFiltersByType,
} from "../features/post/postSlice";

function DisplayPosts() {
  const dispatch = useDispatch();
  const location = useLocation();

  // Extract path and ensure it's one of our valid types
  const rawPath = location.pathname.split("/")[1];
  const path = useMemo(() => {
    // Convert path to a valid post type and ensure it exists
    // Use a default if the path is not a valid type
    const validPath = ["news", "events", "restaurants"].includes(rawPath)
      ? rawPath
      : "news";
    return validPath;
  }, [rawPath]);

  const postType = useMemo(
    () => path.charAt(0).toUpperCase() + path.slice(1),
    [path]
  );

  // Use selective selectors for specific post type to prevent unnecessary rerenders
  const isLoading = useSelector((state) => state.post.isLoading);
  const error = useSelector((state) => state.post.error);

  // Get posts and pagination for the current post type only
  const posts = useSelector((state) => selectPostsByType(state, path));
  const { currentPage, totalPages, totalCount } = useSelector((state) =>
    selectPaginationByType(state, path)
  );
  const {
    searchQuery = "",
    filterOption = "all",
    sortOption = "newest",
  } = useSelector((state) => selectFiltersByType(state, path)) || {};

  // Memoize the fetch parameters object to prevent recreating it on every render
  const fetchParams = useMemo(
    () => ({
      post_type: path,
      page: currentPage,
      search: searchQuery,
      filter: filterOption,
      sort: sortOption,
      // Use the same perPage value as in the backend
      perPage: 5,
      // Add forceFetch flag when any filter changes
      forceFetch: true,
    }),
    [path, currentPage, searchQuery, filterOption, sortOption]
  );

  // Fetch posts whenever relevant filters change
  useEffect(() => {
    console.log("DisplayPosts - Dispatching fetchPosts with path:", path);
    console.log("DisplayPosts - fetchParams:", fetchParams);
    dispatch(fetchPosts(fetchParams));
  }, [dispatch, fetchParams]);

  // Log current state for debugging
  useEffect(() => {
    console.log("DisplayPosts - Current state:", {
      path,
      posts: posts?.length || 0,
      currentPage,
      totalPages,
      totalCount,
      searchQuery,
      filterOption,
      sortOption,
    });
  }, [
    path,
    posts,
    currentPage,
    totalPages,
    totalCount,
    searchQuery,
    filterOption,
    sortOption,
  ]);

  const handlePageChange = useCallback(
    (page) => dispatch(setCurrentPage({ postType: path, page })),
    [dispatch, path]
  );

  const handleSearch = useCallback(
    (query) => {
      console.log("Search query changed to:", query);
      dispatch(setSearchQuery({ postType: path, query }));
    },
    [dispatch, path]
  );

  const handleFilterChange = useCallback(
    (filter) => dispatch(setFilterOption({ postType: path, filter })),
    [dispatch, path]
  );

  const handleSortChange = useCallback(
    (sort) => dispatch(setSortOption({ postType: path, sort })),
    [dispatch, path]
  );

  if (isLoading && posts.length === 0)
    return (
      <div className="text-center h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="border-b-1 border-[#1EB8CC]">
      <PageTitle title={postType} />
      <Banner postType={postType} />
      <FilterBar
        totalResults={totalCount || 0}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onSort={handleSortChange}
        searchQuery={searchQuery}
      />
      <Posts posts={posts} postType={postType} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default React.memo(DisplayPosts);
