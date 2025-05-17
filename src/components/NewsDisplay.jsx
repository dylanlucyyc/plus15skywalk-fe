import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NewsCard from "./NewsCard";
import Button from "./Button";
import { fetchPosts, selectPostsByType } from "../features/post/postSlice";

function NewsDisplay() {
  const dispatch = useDispatch();
  const news = useSelector((state) => selectPostsByType(state, "news"));
  const isLoading = useSelector((state) => state.post.isLoading);

  useEffect(() => {
    // Only fetch if we don't already have news data
    if (news.length === 0) {
      dispatch(
        fetchPosts({
          post_type: "news",
          page: 1,
          search: "",
          filter: "all",
          sort: "newest",
          perPage: 3,
        })
      );
    }
  }, [dispatch, news.length]);

  const renderNewsCards = () => {
    if (isLoading && news.length === 0) {
      return (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (news.length === 0) {
      return <p className="text-gray-500">No news available at the moment</p>;
    }

    return news
      .slice(0, 3)
      .map((newsItem) => <NewsCard key={newsItem._id} post={newsItem} />);
  };

  return (
    <div className="w-full md:w-1/2 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">+15 SKYWALK NEWS</h2>
        <Button as="a" href="/news">
          View All
        </Button>
      </div>
      <div className="flex flex-col gap-4 w-full justify-between">
        {renderNewsCards()}
      </div>
    </div>
  );
}

export default React.memo(NewsDisplay);
