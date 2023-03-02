import { configureStore, createSlice } from "@reduxjs/toolkit";

import { getItem } from "../utills/localStorage";

const initialState = {
  jwtToken: null,
  osmToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.jwtToken = action.payload.jwtToken;
      state.osmToken = action.payload.osmToken;
      state.user = action.payload.user;
    },
    logout(state) {
      state.jwtToken = null;
      state.osmToken = null;
      state.user = null;
    },
  },
});

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export const handleLogin = () => {
  if (getItem("jwt_token")) {
    store.dispatch(
      authSlice.actions.login({
        jwtToken: getItem("jwt_token"),
        osmToken: getItem("osm_token"),
        user: {
          username: getItem("username"),
          user_id: getItem("user_id"),
          role: getItem("role"),
          picture_url: getItem("picture_url"),
        },
      })
    );
  }
};

export const authActions = authSlice.actions;

export default store;
