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


const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder
      .addCase(getProducts.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.status = "fetchedProducts";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export const selectAllProducts = (state) => state.product.items;
export const getProductsStatus = (state) => state.product.status;
export const getProductsError = (state) => state.product.error;
export default productSlice.reducer;