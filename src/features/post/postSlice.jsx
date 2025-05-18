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
    news: { currentPage: 1, totalPages: 1, totalCount: 0 },
    events: { currentPage: 1, totalPages: 1, totalCount: 0 },
    restaurants: { currentPage: 1, totalPages: 1, totalCount: 0 },
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
        state.paginationByType[postType] = {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
        };
      }

      // Preserve other pagination properties when changing page
      const existingPagination = state.paginationByType[postType];
      state.paginationByType[postType] = {
        ...existingPagination,
        currentPage: page,
      };
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

      // Reset to page 1 when search query changes
      if (!state.paginationByType[postType]) {
        state.paginationByType[postType] = {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
        };
      }

      // Preserve other pagination properties when resetting to page 1
      const existingPagination = state.paginationByType[postType];
      state.paginationByType[postType] = {
        ...existingPagination,
        currentPage: 1,
      };
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

      // Reset to page 1 when filter changes
      if (!state.paginationByType[postType]) {
        state.paginationByType[postType] = {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
        };
      }

      // Preserve other pagination properties when resetting to page 1
      const existingPagination = state.paginationByType[postType];
      state.paginationByType[postType] = {
        ...existingPagination,
        currentPage: 1,
      };
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

      // Reset to page 1 when sort option changes
      if (!state.paginationByType[postType]) {
        state.paginationByType[postType] = {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
        };
      }

      // Preserve other pagination properties when resetting to page 1
      const existingPagination = state.paginationByType[postType];
      state.paginationByType[postType] = {
        ...existingPagination,
        currentPage: 1,
      };
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
        const { postType, posts, totalPages, totalCount } = action.payload;
        console.log(
          "fetchPosts.fulfilled - Saving data for postType:",
          postType
        );
        console.log("fetchPosts.fulfilled - Posts:", posts);
        console.log("fetchPosts.fulfilled - Total Pages:", totalPages);
        console.log("fetchPosts.fulfilled - Total Count:", totalCount);

        // Initialize postsByType[postType] if not already initialized
        if (!state.postsByType[postType]) {
          state.postsByType[postType] = [];
        }
        state.postsByType[postType] = posts || [];

        // Initialize paginationByType[postType] if not already initialized
        if (!state.paginationByType[postType]) {
          state.paginationByType[postType] = {
            currentPage: 1,
            totalPages: 1,
            totalCount: 0,
          };
        }

        // Use totalPages from API response instead of calculating locally
        state.paginationByType[postType].totalPages = totalPages || 1;
        state.paginationByType[postType].totalCount = totalCount || 0;

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
      perPage = 5,
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

      // Add safeguards to handle undefined filtersByType[postType]
      const filtersByTypeForPostType = state.post.filtersByType[postType] || {
        searchQuery: "",
        filterOption: "all",
        sortOption: "newest",
      };

      const currentSearchQuery = filtersByTypeForPostType.searchQuery;
      const currentFilterOption = filtersByTypeForPostType.filterOption;
      const currentSortOption = filtersByTypeForPostType.sortOption;

      // IMPORTANT: Always fetch new data when search/filter/sort changes or force fetch is requested
      const shouldUseCachedData =
        !forceFetch &&
        lastFetched &&
        Date.now() - lastFetched < 5 * 60 * 1000 && // 5 minutes cache
        search === currentSearchQuery &&
        filter === currentFilterOption &&
        sort === currentSortOption &&
        state.post.postsByType[postType]?.length > 0;

      console.log("Should use cached data:", shouldUseCachedData);
      console.log(
        "Current search:",
        search,
        "State search:",
        currentSearchQuery
      );

      if (shouldUseCachedData) {
        // Use cached data
        console.log("Using cached data for", postType);
        const paginationData = state.post.paginationByType[postType] || {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
        };

        return {
          postType,
          posts: state.post.postsByType[postType],
          totalPages: paginationData.totalPages,
          totalCount: paginationData.totalCount,
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

      return {
        postType,
        posts: response.data.posts,
        totalPages: response.data.totalPages,
        totalCount: response.data.totalCount,
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
