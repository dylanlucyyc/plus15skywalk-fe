import { configureStore, combineReducers } from "@reduxjs/toolkit";
import subscribeReducer from "../features/subscribe/subscribeSlice";
import userReducer from "../features/user/userSlice";
import postReducer from "../features/post/postSlice";
import favoriteReducer from "../features/favorite/favoriteSlice";
// import commentReducer from "../features/comment/commentSlice";

const rootReducer = combineReducers({
  subscribe: subscribeReducer,
  user: userReducer,
  post: postReducer,
  favorite: favoriteReducer,
  // comment: commentReducer,
  // post: postReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
