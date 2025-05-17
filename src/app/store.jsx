import { configureStore, combineReducers } from "@reduxjs/toolkit";
import subscribeReducer from "../features/subscribe/subscribeSlice";
import userReducer from "../features/user/userSlice";
import postReducer from "../features/post/postSlice";
// import commentReducer from "../features/comment/commentSlice";

const rootReducer = combineReducers({
  subscribe: subscribeReducer,
  user: userReducer,
  post: postReducer,
  // comment: commentReducer,
  // post: postReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
