import React, { memo } from "react";
import PropTypes from "prop-types";
import NewsCard from "./NewsCard";
import EventCard from "./EventCard";
import RestaurantCard from "./RestaurantCard";
import AppearOnScroll from "../../components/AppearOnScroll";
const Posts = ({ posts, postType }) => {
  const renderContent = () => {
    if (!posts || posts.length === 0) {
      return (
        <p className="text-center text-gray-500">
          No {postType} available at the moment
        </p>
      );
    }

    switch (postType.toLowerCase()) {
      case "news":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <NewsCard key={post._id} post={post} />
            ))}
          </div>
        );
      case "events":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {console.log(posts)}
            {posts.map((post) => (
              <EventCard key={post._id} event={post} />
            ))}
          </div>
        );
      case "restaurants":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <RestaurantCard key={post._id} post={post} />
            ))}
          </div>
        );
      default:
        return <p className="text-center">No content available</p>;
    }
  };

  return (
    <AppearOnScroll>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 capitalize">{postType}</h2>
        {renderContent()}
      </div>
    </AppearOnScroll>
  );
};

Posts.propTypes = {
  posts: PropTypes.array,
  postType: PropTypes.string.isRequired,
};

export default memo(Posts);
