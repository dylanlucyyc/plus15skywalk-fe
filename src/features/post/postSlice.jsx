import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";

const initialState = {
  isLoading: false,
  error: null,
  // Separate posts by type
  postsByType: {
    news: [],
    events: [],
    restaurants: [],
  },
  currentPost: null,
  // Separate pagination by type
  paginationByType: {
    news: { currentPage: 1, totalPages: 1 },
    events: { currentPage: 1, totalPages: 1 },
    restaurants: { currentPage: 1, totalPages: 1 },
  },
  // Separate filters by type
  filtersByType: {
    news: { searchQuery: "", filterOption: "all", sortOption: "newest" },
    events: { searchQuery: "", filterOption: "all", sortOption: "newest" },
    restaurants: { searchQuery: "", filterOption: "all", sortOption: "newest" },
  },
  // Track last fetched timestamps to implement caching
  lastFetched: {
    news: null,
    events: null,
    restaurants: null,
  },
};

const slice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      const { postType, page } = action.payload;
      if (!state.paginationByType[postType]) {
        state.paginationByType[postType] = { currentPage: 1, totalPages: 1 };
      }
      state.paginationByType[postType].currentPage = page;
    },
    setSearchQuery: (state, action) => {
      const { postType, query } = action.payload;
      if (!state.filtersByType[postType]) {
        state.filtersByType[postType] = {
          searchQuery: "",
          filterOption: "all",
          sortOption: "newest",
        };
      }
      state.filtersByType[postType].searchQuery = query;
    },
    setFilterOption: (state, action) => {
      const { postType, filter } = action.payload;
      if (!state.filtersByType[postType]) {
        state.filtersByType[postType] = {
          searchQuery: "",
          filterOption: "all",
          sortOption: "newest",
        };
      }
      state.filtersByType[postType].filterOption = filter;
    },
    setSortOption: (state, action) => {
      const { postType, sort } = action.payload;
      if (!state.filtersByType[postType]) {
        state.filtersByType[postType] = {
          searchQuery: "",
          filterOption: "all",
          sortOption: "newest",
        };
      }
      state.filtersByType[postType].sortOption = sort;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        const postType = action.payload.post_type;
        // Make sure postsByType exists for this type
        if (!state.postsByType[postType]) {
          state.postsByType[postType] = [];
        }
        state.postsByType[postType].push(action.payload);
        toast.success("Post created successfully");
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Update Post
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        const postType = action.payload.post_type;
        // Make sure postsByType exists for this type
        if (!state.postsByType[postType]) {
          state.postsByType[postType] = [];
        }
        const index = state.postsByType[postType].findIndex(
          (post) => post._id === action.payload._id
        );
        if (index !== -1) {
          state.postsByType[postType][index] = action.payload;
        }
        if (state.currentPost?._id === action.payload._id) {
          state.currentPost = action.payload;
        }
        toast.success("Post updated successfully");
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Get Post
      .addCase(getPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPost = action.payload;
      })
      .addCase(getPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Fetch User Posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        // User posts doesn't fit into our separation by type, so we'll handle it differently
        // We could track these separately if needed
        state.userPosts = action.payload.posts;
        state.userPostsTotalPages = action.payload.totalPages;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Fetch All Posts
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        const { postType, posts } = action.payload;
        console.log(
          "fetchPosts.fulfilled - Saving data for postType:",
          postType
        );
        console.log("fetchPosts.fulfilled - Posts:", posts);

        // Initialize postsByType[postType] if not already initialized
        if (!state.postsByType[postType]) {
          state.postsByType[postType] = [];
        }
        state.postsByType[postType] = posts || [];

        // Initialize paginationByType[postType] if not already initialized
        if (!state.paginationByType[postType]) {
          state.paginationByType[postType] = { currentPage: 1, totalPages: 1 };
        }
        state.paginationByType[postType].totalPages =
          posts && posts.length ? Math.ceil(posts.length / 10) : 1;

        // Initialize lastFetched[postType] if not already initialized
        if (!state.lastFetched) {
          state.lastFetched = {};
        }
        state.lastFetched[postType] = Date.now();
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

// Async thunks
export const createPost = createAsyncThunk(
  "post/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      const accessToken = window.localStorage.getItem("accessToken");
      const response = await apiService.post("api/posts", postData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  "post/updatePost",
  async ({ postId, postData }, { rejectWithValue }) => {
    try {
      const accessToken = window.localStorage.getItem("accessToken");
      const response = await apiService.put(`api/posts/${postId}`, postData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPost = createAsyncThunk(
  "post/getPost",
  async (postId, { rejectWithValue }) => {
    try {
      const accessToken = window.localStorage.getItem("accessToken");
      const response = await apiService.get(`api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  "post/fetchUserPosts",
  async (userId, { rejectWithValue }) => {
    try {
      const accessToken = window.localStorage.getItem("accessToken");
      const response = await apiService.get(`api/posts/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPosts = createAsyncThunk(
  "post/fetchPosts",
  async (
    {
      post_type,
      page = 1,
      search,
      filter,
      sort,
      perPage = 10,
      forceFetch = false,
    },
    { rejectWithValue, getState }
  ) => {
    try {
      console.log("Fetching posts with params:", {
        post_type,
        page,
        search,
        filter,
        sort,
      });
      const state = getState();
      const postType = post_type;
      const lastFetched = state.post.lastFetched[postType];

      // If we have data and it was fetched recently (< 5 min) and no filter changes, skip the fetch
      const cacheTime = 5 * 60 * 1000; // 5 minutes in milliseconds

      // Add safeguards to handle undefined filtersByType[postType]
      const filtersByTypeForPostType = state.post.filtersByType[postType] || {
        searchQuery: "",
        filterOption: "all",
        sortOption: "newest",
      };

      const currentSearchQuery = filtersByTypeForPostType.searchQuery;
      const currentFilterOption = filtersByTypeForPostType.filterOption;
      const currentSortOption = filtersByTypeForPostType.sortOption;

      const shouldUseCachedData =
        !forceFetch &&
        lastFetched &&
        Date.now() - lastFetched < cacheTime &&
        search === currentSearchQuery &&
        filter === currentFilterOption &&
        sort === currentSortOption &&
        state.post.postsByType[postType]?.length > 0;

      console.log("Should use cached data:", shouldUseCachedData);

      if (shouldUseCachedData) {
        // Use cached data
        console.log("Using cached data for", postType);
        return {
          postType,
          posts: state.post.postsByType[postType],
        };
      }

      // Otherwise fetch fresh data
      const accessToken = window.localStorage.getItem("accessToken");

      // Build query parameters properly
      const queryParams = new URLSearchParams();
      queryParams.append("post_type", post_type || "");
      queryParams.append("page", page);
      queryParams.append("per_page", perPage);

      // Only add non-empty parameters
      if (search) queryParams.append("search", search);
      if (filter) queryParams.append("filter", filter);
      if (sort) queryParams.append("sort", sort);

      const url = `api/posts?${queryParams.toString()}`;
      console.log("Fetching from API:", url);

      const response = await apiService.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("API response:", response.data);

      return {
        postType,
        posts: response.data,
      };
    } catch (error) {
      console.error("Error fetching posts:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Create memoized selectors
export const selectPostsByType = createSelector(
  [(state) => state.post.postsByType, (_, postType) => postType],
  (postsByType, postType) => postsByType[postType] || []
);

export const selectPaginationByType = createSelector(
  [(state) => state.post.paginationByType, (_, postType) => postType],
  (paginationByType, postType) =>
    paginationByType[postType] || { currentPage: 1, totalPages: 1 }
);

export const selectFiltersByType = createSelector(
  [(state) => state.post.filtersByType, (_, postType) => postType],
  (filtersByType, postType) => {
    // Make sure we have a valid type and it exists in our state
    if (!postType || !filtersByType || !filtersByType[postType]) {
      return {
        searchQuery: "",
        filterOption: "all",
        sortOption: "newest",
      };
    }
    return filtersByType[postType];
  }
);

export const {
  setCurrentPage,
  setSearchQuery,
  setFilterOption,
  setSortOption,
} = slice.actions;

export default slice.reducer;
