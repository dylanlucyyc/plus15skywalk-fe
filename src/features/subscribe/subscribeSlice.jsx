import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";

const initialState = {
  subscribe: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "subscribe",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    hasError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSubscribe: (state, action) => {
      state.subscribe = action.payload;
      state.loading = false;
    },
  },
});

export const createSubscriber =
  ({ email }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.post(`/api/subscribers`, {
        email: email,
      });
      dispatch(
        slice.actions.setSubscribe({
          ...response.data,
          email,
        })
      );
      toast.success("Successfully subscribed!");
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
      const errorMessage = error.message || "Subscription failed";
      toast.error(errorMessage);
    }
  };

export default slice.reducer;
