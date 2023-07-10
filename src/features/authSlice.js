import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl=process.env.REACT_APP_API_URL

const initialState = {
  token: "",
  status: "idle",
  error: null,
  loading: false,
};

export const login = createAsyncThunk("user/authLogin", async (body) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/login`, body);
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});


const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUser: (state) => {
      state.token = localStorage.getItem("token");
    },
    logOut: (state) => {
      localStorage.removeItem("token");
      state.token = "";
    },
    updateStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "logedIn";
        state.loading = false;
        state.token = action.payload.token;
        localStorage.setItem("token", JSON.stringify(action.payload.token));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export const { getUser, logOut, updateStatus } = authSlice.actions;
export const getUserStatus = (state) => state.user.status;
export const getUserError = (state) => state.user.error;
export const getUserLoading = (state) => state.user.loading;
export default authSlice.reducer;