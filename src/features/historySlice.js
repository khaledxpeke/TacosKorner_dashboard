import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl=process.env.REACT_APP_API_URL
const initialState = {
  items: [],
  recents: [],
  status: "idle",
  error: null,
  loading: false,
};

export const fetchHistory = createAsyncThunk("history/getAll", async () => {
  try {
    const response = await axios.get(`${apiUrl}/history`);
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});

export const fetchRecentHistories = createAsyncThunk(
  "history/getRecentHistories",
  async () => {
    try {
      const response = await axios.get(`${apiUrl}/history/10`);
      return response?.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }
);

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    updateStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchHistory.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.status = "fetchData";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.status = "fetchError";
        state.loading = false;
        state.error = action.error.message;
      }).addCase(fetchRecentHistories.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchRecentHistories.fulfilled, (state, action) => {
        state.status = "fetchRecentsData";
        state.loading = false;
        state.recents = action.payload;
      })
      .addCase(fetchRecentHistories.rejected, (state, action) => {
        state.status = "fetchRecentsError";
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectAllHistory = (state) => state.history.items;
export const getHistoryStatus = (state) => state.history.status;
export const getHistoryError = (state) => state.history.error;

export const selectRecentHistory = (state) => state.history.recents;
export const getRecentHistoryStatus = (state) => state.history.status;
export const getRecentHistoryError = (state) => state.history.error;
export default historySlice.reducer;
