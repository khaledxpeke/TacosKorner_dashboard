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

export const getIngrediants = createAsyncThunk(
  "ingrediant/getIngrediants",
  async () => {
    try {
      const response = await axios.get(`${apiUrl}/ingrediant`);
      return response?.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }
);

export const getIngrediantsByType = createAsyncThunk(
  "ingrediant/getIngrediantsByType",
  async () => {
    try {
      const response = await axios.get(`${apiUrl}/ingrediant/ingrediants`);
      return response?.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }
);

export const addIngrediant = createAsyncThunk(
  "ingrediant/addIngrediant",
  async (body) => {
    try {
      const response = await axios.post(
        `${apiUrl}/ingrediant`,
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

export const modifyIngrediant = createAsyncThunk(
  "ingrediant/modifyIngrediant",
  async ({ body, ingrediantId }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/ingrediant/update/${ingrediantId}`,
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

export const deleteIngrediant = createAsyncThunk(
  "ingrediant/deleteIngrediant",
  async (ingrediantId) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/ingrediant/${ingrediantId}`,
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
        state.status = "fetchData";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getIngrediants.rejected, (state, action) => {
        state.status = "fetchError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getIngrediantsByType.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getIngrediantsByType.fulfilled, (state, action) => {
        state.status = "fetchDataByType";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getIngrediantsByType.rejected, (state, action) => {
        state.status = "fetchErrorByType";
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
        state.success = action.payload.message;
      })
      .addCase(addIngrediant.rejected, (state, action) => {
        state.status = "addError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteIngrediant.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(deleteIngrediant.fulfilled, (state, action) => {
        state.status = "deleteSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(deleteIngrediant.rejected, (state, action) => {
        state.status = "deleteError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(modifyIngrediant.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(modifyIngrediant.fulfilled, (state, action) => {
        state.status = "modifySuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(modifyIngrediant.rejected, (state, action) => {
        state.status = "modifyError";
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { updateStatus } = ingrediantSlice.actions;
export const selectAllIngrediants = (state) => state.ingrediant.items;
export const getIngrediantsStatus = (state) => state.ingrediant.status;
export const getIngrediantsError = (state) => state.ingrediant.error;
export const getIngrediantsSuccess = (state) => state.ingrediant.success;
export const getIngrediantsLoading = (state) => state.ingrediant.loading;
export default ingrediantSlice.reducer;
