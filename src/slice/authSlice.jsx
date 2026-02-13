import { createSlice } from "@reduxjs/toolkit";

const existUsers = JSON.parse(localStorage.getItem("records")) || [];

const initialState = {
  isAuthenticate: false,
  error: null,
  users: existUsers,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signup: (state, action) => {
      state.users = action.payload;
      localStorage.setItem("records", JSON.stringify(state.users));
    },
    login: (state, action) => {},
    logout: (state, action) => {},
  },
});
export const { signup, login, logout } = authSlice;
export default authSlice.reducer;
