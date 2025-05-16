import { configureStore, combineReducers } from "@reduxjs/toolkit";
import subscribeReducer from "../features/subscribe/subscribeSlice";

const rootReducer = combineReducers({
  subscribe: subscribeReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
