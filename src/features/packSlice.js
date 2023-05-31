import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  loading: false,
};

export const getPack = createAsyncThunk("pack/getPack", async () => {
  try {
    const response = await axios.get(
      "http://localhost:3300/api/pack",
    );
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});


const packSlice = createSlice({
  name: "pack",
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder
      .addCase(getPack.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getPack.fulfilled, (state, action) => {
        state.status = "fetchData";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getPack.rejected, (state, action) => {
        state.status = "fetchError";
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export const selectAllPack = (state) => state.pack.items;
export const getPackStatus = (state) => state.pack.status;
export const getPackError = (state) => state.pack.error;
export default packSlice.reducer;