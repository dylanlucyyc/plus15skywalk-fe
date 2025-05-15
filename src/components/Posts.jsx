import React from "react";
import PropTypes from "prop-types";
import NewsCard from "./NewsCard";
import EventCard from "./EventCard";
import RestaurantCard from "./RestaurantCard";

const POSTS_PER_PAGE = 6;

const Posts = ({ currentPage, postType }) => {
  const renderContent = () => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;

    switch (postType.toLowerCase()) {
      case "news":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NewsCard />
            <NewsCard />
            <NewsCard />
            <NewsCard />
            <NewsCard />
          </div>
        );
      case "events":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <EventCard />
            <EventCard />
            <EventCard />
            <EventCard />
            <EventCard />
          </div>
        );
      case "restaurants":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RestaurantCard />
            <RestaurantCard />
            <RestaurantCard />
            <RestaurantCard />
            <RestaurantCard />
          </div>
        );
      default:
        return <p className="text-center">No content available</p>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 capitalize">{postType}</h2>
      {renderContent()}
    </div>
  );
};

Posts.propTypes = {
  currentPage: PropTypes.number.isRequired,
  postType: PropTypes.string.isRequired,
};

export default Posts;
