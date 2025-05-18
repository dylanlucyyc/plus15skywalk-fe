import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUserPosts } from "./postSlice";

function PostList({ userId }) {
  const dispatch = useDispatch();
  const { userPosts, isLoading } = useSelector((state) => ({
    userPosts: state.post.userPosts || [],
    isLoading: state.post.isLoading,
  }));

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserPosts(userId));
    }
  }, [dispatch, userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!userPosts || userPosts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No posts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {userPosts.map((post) => (
        <div
          key={post._id}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          <Link to={`/news/${post.slug}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {post.title}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm mb-2">
            {post.content.substring(0, 150)}...
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
            <div className="flex items-center space-x-4">
              <span>{post.likes?.length || 0} likes</span>
              <span>{post.comments?.length || 0} comments</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default React.memo(PostList);
