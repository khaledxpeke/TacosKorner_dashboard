import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  loading: false,
};

export const getDeserts = createAsyncThunk("desert/getDeserts", async () => {
  try {
    const response = await axios.get(
      "http://localhost:3300/api/desert",
    );
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});


const desertSlice = createSlice({
  name: "desert",
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder
      .addCase(getDeserts.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getDeserts.fulfilled, (state, action) => {
        state.status = "fetchData";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getDeserts.rejected, (state, action) => {
        state.status = "fetchError";
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export const selectAllDeserts = (state) => state.desert.items;
export const getDesertsStatus = (state) => state.desert.status;
export const getDesertsError = (state) => state.desert.error;
export default desertSlice.reducer;