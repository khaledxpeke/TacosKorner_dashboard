import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl=process.env.REACT_APP_API_URL
const initialState = {
  items: [],
  status: "idle",
  error: null,
  success: null,
  loading: false,
};

export const fetchCategories = createAsyncThunk("category/getAll", async () => {
  try {
    const response = await axios.get(`${apiUrl}/category`);
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
        `${apiUrl}/category`,
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

export const modifyCategory = createAsyncThunk(
  "category/modifyCategory",
  async ({body,categoryId}) => {
    try {
      const response = await axios.put(
        `${apiUrl}/category/update/${categoryId}`,
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
      const response = await axios.delete(
        `${apiUrl}/category/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage
              .getItem("token")
              .replace(/^"|"$/g, "")}`,
          },
        }
      );
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
        state.status = "fetchData";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "fetchError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCategory.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.status = "addSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.status = "addError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteCategory.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = "deleteSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "deleteError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(modifyCategory.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(modifyCategory.fulfilled, (state, action) => {
        state.status = "modifySuccess";
        state.loading = false;
        state.success = action.payload.message;
        console.log(action.payload);
      })
      .addCase(modifyCategory.rejected, (state, action) => {
        state.status = "modifyError";
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateStatus } = categoriesSlice.actions;
export const selectAllCategories = (state) => state.categories.items;
export const getCategoriesStatus = (state) => state.categories.status;
export const getCategoriesError = (state) => state.categories.error;
export const getCategoriesSuccess = (state) => state.categories.success;
export const getCategoriesLoading = (state) => state.categories.loading;
export default categoriesSlice.reducer;
