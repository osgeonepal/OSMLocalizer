import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
  jwtToken: null,
  osmToken: null,
  user: null
}

const authSlice = createSlice({
  name: 'auth',
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
    }
  }
});

const store = configureStore({
  reducer: {
    auth: authSlice.reducer
  }
});

// Check local storage for user data and dispatch a login action if user exists
const user = JSON.parse(localStorage.getItem('user'));
if (user) {
  store.dispatch(authSlice.actions.login(user));
}

export const authActions = authSlice.actions;

export default store;