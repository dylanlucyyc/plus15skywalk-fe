import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";

// Async Thunks
export const createFavorite = createAsyncThunk(
  "favorite/createFavorite",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await apiService.post("/api/favorites", {
        post_id: postId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFavorite = createAsyncThunk(
  "favorite/deleteFavorite",
  async (favoriteId, { rejectWithValue }) => {
    try {
      const response = await apiService.delete(`/api/favorites/${favoriteId}`);
      return { ...response.data, favoriteId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFavoriteByPostId = createAsyncThunk(
  "favorite/deleteFavoriteByPostId",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await apiService.delete(`/api/favorites/post/${postId}`);
      return { ...response.data, postId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserFavorites = createAsyncThunk(
  "favorite/getUserFavorites",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/api/favorites/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkFavorite = createAsyncThunk(
  "favorite/checkFavorite",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/api/favorites/check/${postId}`);
      return { ...response.data, postId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getFavoriteCount = createAsyncThunk(
  "favorite/getFavoriteCount",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/api/favorites/count/${postId}`);
      return { ...response.data, postId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  isLoading: false,
  error: null,
  userFavorites: [],
  favoriteCounts: {}, // Map of postId -> count
  favoriteStatus: {}, // Map of postId -> isFavorited boolean
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create favorite
      .addCase(createFavorite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createFavorite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const postId = action.payload.data.post_id;
        // Update favorite status
        state.favoriteStatus[postId] = true;
        // Update count if exists
        if (state.favoriteCounts[postId] !== undefined) {
          state.favoriteCounts[postId] =
            (state.favoriteCounts[postId] || 0) + 1;
        }
        // Add to user favorites
        state.userFavorites.push(action.payload.data);
        toast.success("Post added to favorites");
      })
      .addCase(createFavorite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to add to favorites");
      })

      // Delete favorite
      .addCase(deleteFavorite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFavorite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Remove from user favorites
        state.userFavorites = state.userFavorites.filter(
          (fav) => fav._id !== action.payload.favoriteId
        );
        toast.success("Removed from favorites");
      })
      .addCase(deleteFavorite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to remove from favorites");
      })

      // Delete favorite by post ID
      .addCase(deleteFavoriteByPostId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFavoriteByPostId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const postId = action.payload.postId;
        // Update favorite status
        state.favoriteStatus[postId] = false;
        // Update count if exists
        if (state.favoriteCounts[postId] !== undefined) {
          state.favoriteCounts[postId] = Math.max(
            0,
            (state.favoriteCounts[postId] || 0) - 1
          );
        }
        // Remove from user favorites
        state.userFavorites = state.userFavorites.filter(
          (fav) => fav.post_id._id !== postId
        );
        toast.success("Removed from favorites");
      })
      .addCase(deleteFavoriteByPostId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to remove from favorites");
      })

      // Get user favorites
      .addCase(getUserFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.userFavorites = action.payload.data;

        // Update favorite status based on user favorites
        action.payload.data.forEach((favorite) => {
          const postId = favorite.post_id._id;
          state.favoriteStatus[postId] = true;
        });
      })
      .addCase(getUserFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to fetch favorites");
      })

      // Check favorite
      .addCase(checkFavorite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkFavorite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const postId = action.payload.postId;
        state.favoriteStatus[postId] = action.payload.isFavorited;
      })
      .addCase(checkFavorite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get favorite count
      .addCase(getFavoriteCount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFavoriteCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const postId = action.payload.postId;
        state.favoriteCounts[postId] = action.payload.count;
      })
      .addCase(getFavoriteCount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default favoriteSlice.reducer;
