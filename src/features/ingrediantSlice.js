import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  loading: false,
};

export const getIngrediants = createAsyncThunk("ingrediant/getIngrediants", async () => {
  try {
    const response = await axios.get(
      "http://localhost:3300/api/ingrediant",
    );
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});


const ingrediantSlice = createSlice({
  name: "ingrediant",
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder
      .addCase(getIngrediants.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getIngrediants.fulfilled, (state, action) => {
        state.status = "fetchData";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getIngrediants.rejected, (state, action) => {
        state.status = "fetchError";
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export const selectAllIngrediants = (state) => state.ingrediant.items;
export const getIngrediantsStatus = (state) => state.ingrediant.status;
export const getIngrediantsError = (state) => state.ingrediant.error;
export default ingrediantSlice.reducer;