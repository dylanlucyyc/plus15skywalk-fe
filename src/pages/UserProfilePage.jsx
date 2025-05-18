import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser, getCurrentUserProfile } from "../features/user/userSlice";
import {
  FiEdit2,
  FiMapPin,
  FiBriefcase,
  FiFileText,
  FiPlus,
} from "react-icons/fi";
import EditProfileModal from "../components/user/EditProfileModal";
import LoadingScreen from "../components/LoadingScreen";
import NewsCard from "../components/NewsCard";
import EventCard from "../components/EventCard";
import RestaurantCard from "../components/RestaurantCard";
import { fetchUserPosts } from "../features/post/postSlice";
import BlankProfile from "../assets/images/blank-profile-picture.webp";
import useAuth from "../hooks/useAuth";

function UserProfilePage() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedUser, isLoading: userLoading } =
    useSelector((state) => state.user) || {};
  const { userPosts, isLoading: postsLoading } = useSelector((state) => ({
    userPosts: state.post?.userPosts || [],
    isLoading: state.post?.isLoading,
  }));
  const { user } = useAuth();
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(getUser(userId));
    } else {
      dispatch(getCurrentUserProfile());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    console.log("here");
    if (selectedUser?._id) {
      dispatch(fetchUserPosts(selectedUser._id));
    }
  }, [dispatch, selectedUser?._id]);

  if (userLoading) {
    return <LoadingScreen />;
  }

  if (!selectedUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            User not found
          </h2>
        </div>
      </div>
    );
  }

  const isOwnProfile =
    !userId || (user && user._id === userId) || userId === "me";

  const renderPostsByType = (posts) => {
    if (postsLoading) {
      return (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!posts || posts.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No posts found</p>
        </div>
      );
    }

    // Group posts by type
    const newsPosts = posts.filter((post) => post.post_type === "news");
    const eventPosts = posts.filter((post) => post.post_type === "events");
    const restaurantPosts = posts.filter(
      (post) => post.post_type === "restaurants"
    );

    return (
      <div className="space-y-8">
        {newsPosts.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-4">News</h4>
            <div className="flex flex-col gap-4">
              {newsPosts.map((post) => (
                <NewsCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        )}

        {eventPosts.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-4">Events</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventPosts.map((post) => (
                <EventCard key={post._id} event={post} />
              ))}
            </div>
          </div>
        )}

        {restaurantPosts.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-4">Restaurants</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restaurantPosts.map((post) => (
                <RestaurantCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="md:col-span-1">
          <div className="bg-white shadow-md p-6 flex flex-col items-center">
            <img
              src={selectedUser?.avatar_url || BlankProfile}
              alt={selectedUser?.name}
              className="w-32 h-32 rounded-full mb-4 object-cover"
            />
            <h2 className="text-2xl font-semibold mb-4">
              {selectedUser?.name}
            </h2>
            <p className="text-gray-600 mb-4">{selectedUser?.email}</p>

            {isOwnProfile && (
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setOpenEditModal(true)}
                  className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FiEdit2 className="mr-2" />
                  Edit Profile
                </button>
                <button
                  onClick={() => navigate("/post/new")}
                  className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FiPlus className="mr-2" />
                  Make Post
                </button>
              </div>
            )}

            <div className="w-full border-t border-gray-200 my-4" />

            <div className="w-full text-center text-gray-600">
              <p>
                Member since{" "}
                {new Date(selectedUser?.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="md:col-span-2">
          <div className="bg-white shadow-md p-6 mb-4">
            <h3 className="text-xl font-semibold mb-4">Favorites</h3>
            <div className="text-center py-4">
              <p className="text-gray-500">No favorites yet</p>
            </div>
          </div>

          <div className="bg-white shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Posts</h3>
            {renderPostsByType(userPosts)}
          </div>
        </div>
      </div>

      <EditProfileModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        user={selectedUser}
      />
    </div>
  );
}

export default UserProfilePage;
