import { configureStore, combineReducers } from "@reduxjs/toolkit";
import subscribeReducer from "../features/subscribe/subscribeSlice";
import userReducer from "../features/user/userSlice";
// import commentReducer from "../features/comment/commentSlice";
// import postReducer from "../features/post/postSlice";

const rootReducer = combineReducers({
  subscribe: subscribeReducer,
  user: userReducer,
  // comment: commentReducer,
  // post: postReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
