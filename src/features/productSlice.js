import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  loading: false,
};

export const getProducts = createAsyncThunk("product/getProducts", async () => {
  try {
    const response = await axios.get(
      "http://localhost:3300/api/product",
    );
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async ({ body, categoryId }) => {
    try {
      const response = await axios.post(
        `http://localhost:3300/api/product/${categoryId}`,
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

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    updateStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getProducts.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.status = "fetchData";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.status = "fetchError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addProduct.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.status = "addSuccess";
        state.loading = false;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = "addError";
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export const { updateStatus } = productSlice.actions;
export const selectAllProducts = (state) => state.product.items;
export const getProductsStatus = (state) => state.product.status;
export const getProductsError = (state) => state.product.error;
export const getProductsisLoading = (state) => state.product.loading;
export default productSlice.reducer;