import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  loading: false,
};

export const getSupplements = createAsyncThunk("supplement/getSupplements", async () => {
  try {
    const response = await axios.get(
      "http://localhost:3300/api/supplement",
    );
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});


const supplementSlice = createSlice({
  name: "supplement",
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder
      .addCase(getSupplements.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getSupplements.fulfilled, (state, action) => {
        state.status = "fetchedSupplements";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getSupplements.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export const selectAllSupplements = (state) => state.supplement.items;
export const getSupplementsStatus = (state) => state.supplement.status;
export const getSupplementsError = (state) => state.supplement.error;
export default supplementSlice.reducer;