import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser, getCurrentUserProfile } from "../features/user/userSlice";
import { FiEdit2, FiMapPin, FiBriefcase, FiFileText } from "react-icons/fi";
import EditProfileModal from "../components/user/EditProfileModal";
import LoadingScreen from "../components/LoadingScreen";
import PostList from "../components/post/PostList";
import BlankProfile from "../assets/images/blank-profile-picture.webp";
import useAuth from "../hooks/useAuth";

function UserProfilePage() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { selectedUser, isLoading } = useSelector((state) => state.user) || {};
  const { user } = useAuth();
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(getUser(userId));
    } else {
      dispatch(getCurrentUserProfile());
    }
  }, [dispatch, userId]);

  if (isLoading) {
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
              <button
                onClick={() => setOpenEditModal(true)}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors mb-4"
              >
                <FiEdit2 className="mr-2" />
                Edit Profile
              </button>
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
            {/* Favorite posts */}
          </div>

          <div className="bg-white shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Posts</h3>
            {/* Posts */}
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
