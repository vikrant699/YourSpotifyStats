import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialAuthState = { auth: false };

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    authenticate(state, action) {
      state.auth = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export const { authenticate } = authSlice.actions;
export default store;
