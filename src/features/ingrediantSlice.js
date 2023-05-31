import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  success: null,
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

export const addIngrediant = createAsyncThunk(
  "ingrediant/addIngrediant",
  async (body) => {
    try {
      const response = await axios.post(
        "http://localhost:3300/api/ingrediant",
        body,
        {
          headers: {
            Authorization: `Bearer ${localStorage
              .getItem("token")
              .replace(/^"|"$/g, "")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response?.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }
);
const ingrediantSlice = createSlice({
  name: "ingrediant",
  initialState,
  reducers: {
    updateStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getIngrediants.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getIngrediants.fulfilled, (state, action) => {
        state.status = "fetchedIngrediants";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getIngrediants.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addIngrediant.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(addIngrediant.fulfilled, (state, action) => {
        state.status = "addSuccess";
        state.loading = false;
      })
      .addCase(addIngrediant.rejected, (state, action) => {
        state.status = "addError";
        state.loading = false;
        state.error = action.error.message;
      })
  },
});
export const { updateStatus } = ingrediantSlice.actions;
export const selectAllIngrediants = (state) => state.ingrediant.items;
export const getIngrediantsStatus = (state) => state.ingrediant.status;
export const getIngrediantsError = (state) => state.ingrediant.error;
export const getIngrediantsSuccess = (state) => state.ingrediant.success;
export const getIngrediantsLoading = (state) => state.ingrediant.loading;
export default ingrediantSlice.reducer;