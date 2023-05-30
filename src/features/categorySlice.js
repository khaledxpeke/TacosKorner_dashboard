import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  loading: false,
};

export const fetchCategories = createAsyncThunk("category/getAll", async () => {
  try {
    const response = await axios.get("http://localhost:3300/api/category");
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});

export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (body) => {
    try {
      const response = await axios.post(
        "http://localhost:3300/api/category",
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
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId) => {
    try {
      const response = await axios.delete(`http://localhost:3300/api/category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage
            .getItem("token")
            .replace(/^"|"$/g, "")}`,
        },
      });
      return response?.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    updateStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCategories.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "allCategories";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCategory.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.status = "categoryAdded";
        state.loading = false;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteCategory.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = "categoryDeleted";
        state.loading = false;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "deleteError";
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateStatus } = categoriesSlice.actions;
export const selectAllCategories = (state) => state.categories.items;
export const getCategoriesStatus = (state) => state.categories.status;
export const getCategoriesError = (state) => state.categories.error;
export const getCategoriesLoading = (state) => state.categories.loading;
export default categoriesSlice.reducer;
