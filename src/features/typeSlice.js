import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  loading: false,
};

export const getTypes = createAsyncThunk("type/getTypes", async () => {
  try {
    const response = await axios.get(
      "http://localhost:3300/api/type",
    );
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});


const typeSlice = createSlice({
  name: "type",
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder
      .addCase(getTypes.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getTypes.fulfilled, (state, action) => {
        state.status = "fetchData";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getTypes.rejected, (state, action) => {
        state.status = "fetchError";
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export const selectAllTypes = (state) => state.type.items;
export const getTypesStatus = (state) => state.type.status;
export const getTypesError = (state) => state.type.error;
export default typeSlice.reducer;