import React, { useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  createFavorite,
  deleteFavoriteByPostId,
  checkFavorite,
  getFavoriteCount,
} from "./favoriteSlice";

function FavoriteButton({
  postId,
  size = "md",
  showCount = true,
  className = "",
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [hasLoaded, setHasLoaded] = useState(false);

  const { favoriteStatus, favoriteCounts, isLoading } = useSelector(
    (state) => ({
      favoriteStatus: state.favorite.favoriteStatus,
      favoriteCounts: state.favorite.favoriteCounts,
      isLoading: state.favorite.isLoading,
    })
  );

  const isFavorited = favoriteStatus[postId] || false;
  const count = favoriteCounts[postId] || 0;

  // Check favorite status and count when component mounts
  useEffect(() => {
    if (postId && !hasLoaded) {
      if (isAuthenticated) {
        dispatch(checkFavorite(postId));
      }
      dispatch(getFavoriteCount(postId));
      setHasLoaded(true);
    }
  }, [dispatch, postId, isAuthenticated, hasLoaded]);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/signin", { state: { from: window.location.pathname } });
      return;
    }

    if (isLoading) return;

    if (isFavorited) {
      dispatch(deleteFavoriteByPostId(postId));
    } else {
      dispatch(createFavorite(postId));
    }
  };

  // Size variants
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const iconClassName = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex items-center ${className}`}>
      <button
        onClick={handleToggleFavorite}
        className="flex items-center justify-center focus:outline-none transition-colors"
        disabled={isLoading}
      >
        {isFavorited ? (
          <FaHeart className={`${iconClassName} text-red-500`} />
        ) : (
          <FaRegHeart className={`${iconClassName} hover:text-red-500`} />
        )}
      </button>
      {showCount && (
        <span className="ml-1 text-sm font-medium">
          {count > 0 ? count : ""}
        </span>
      )}
    </div>
  );
}

// Use React.memo to prevent unnecessary re-renders
export default memo(FavoriteButton);
