import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPostBySlug, deletePost } from "../features/post/postSlice";
import useAuth from "../hooks/useAuth";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import EventCard from "../components/EventCard";
import NewsCard from "../components/NewsCard";
import RestaurantCard from "../components/RestaurantCard";
import { fDateTime } from "../utils/formatTime";

// Component to display relevant posts based on posttype
const RelevantPosts = ({ posts, postType }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-2xl font-bold mb-6">
        You might also be interested in
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          switch (postType) {
            case "events":
              return <EventCard key={post._id} event={post} />;
            case "news":
              return <NewsCard key={post._id} post={post} />;
            case "restaurants":
              return <RestaurantCard key={post._id} post={post} />;
            default:
              return <NewsCard key={post._id} post={post} />;
          }
        })}
      </div>
    </div>
  );
};

function SinglePostPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const { currentPost, isLoading } = useSelector((state) => ({
    currentPost: state.post.currentPost,
    isLoading: state.post.isLoading,
  }));

  console.log(currentPost);

  useEffect(() => {
    if (slug) {
      dispatch(getPostBySlug(`${slug}`));
    }
  }, [dispatch, slug]);

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setIsDeleting(true);
      try {
        await dispatch(deletePost(currentPost.post._id)).unwrap();
        navigate("/");
      } catch (error) {
        console.error("Failed to delete post:", error);
        setIsDeleting(false);
      }
    }
  };

  if (isLoading || isDeleting) return <div>Loading...</div>;
  if (!currentPost) return <div>Post not found</div>;

  // Check if the current user is the author of the post
  const isAuthor = user && currentPost?.post?.posted_by?._id === user._id;
  const postType = currentPost?.post?.post_type;
  const relevantPosts = currentPost?.relevantPosts || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <img
        src={currentPost?.post?.image}
        alt={currentPost?.post?.title}
        className="w-full h-64 object-cover mb-4"
      />
      <div className="flex justify-between items-center mb-4">
        <span className="bg-[#1EB8CC] text-white px-4 py-2 inline-block">
          {currentPost?.post?.tags[0]}
        </span>
        {isAuthor && (
          <div className="flex gap-2">
            <Link
              to={`/post/edit/${currentPost?.post?._id}`}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FiEdit2 className="mr-2" />
              Edit Post
            </Link>
            <button
              onClick={handleDeletePost}
              className="flex items-center px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 transition-colors"
            >
              <FiTrash2 className="mr-2" />
              Delete Post
            </button>
          </div>
        )}
      </div>
      <h1 className="text-3xl font-bold mb-4">{currentPost?.post?.title}</h1>
      <p className="text-gray-500 mb-4">
        Posted at {fDateTime(currentPost?.post?.created_at)} by{" "}
        {currentPost?.post?.posted_by?.name}
      </p>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: currentPost?.post?.content }}
      />

      {/* Display relevant posts if available */}
      {relevantPosts.length > 0 && (
        <RelevantPosts posts={relevantPosts} postType={postType} />
      )}
    </div>
  );
}

export default SinglePostPage;
