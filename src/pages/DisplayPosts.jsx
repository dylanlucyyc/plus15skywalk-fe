import React, { useState, useEffect } from "react";
import Banner from "../components/Banner";
import FilterBar from "../components/FilterBar";
import Subscribe from "../features/subscribe/Subscribe";
import Posts from "../components/Posts";
import Pagination from "../components/Pagination";
import { useLocation } from "react-router-dom";

function DisplayPosts() {
  const location = useLocation();
  const [postType, setPostType] = useState(location.pathname);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  useEffect(() => {
    const path = location.pathname.split("/")[1];
    const capitalized = path.charAt(0).toUpperCase() + path.slice(1);
    setPostType(capitalized);
  }, [location.pathname]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Add your logic here to fetch posts for the new page
  };

  return (
    <>
      <Banner postType={postType} />
      <FilterBar />
      <Posts currentPage={currentPage} postType={postType} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <Subscribe />
    </>
  );
}

export default DisplayPosts;
