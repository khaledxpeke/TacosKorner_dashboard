import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const getCarouselMedia = createAsyncThunk(
  "carousel/getCarouselMedia",
  async () => {
    const response = await axios.get(`${apiUrl}/carousel`);
    return response.data;
  }
);

export const addCarouselMedia = createAsyncThunk(
  "carousel/addCarouselMedia",
  async (formData) => {
    const response = await axios.post(`${apiUrl}/carousel`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
);

export const updateCarouselOrder = createAsyncThunk(
  "carousel/updateOrder",
  async (items) => {
    await axios.put(`${apiUrl}/carousel/order`, { items });
    return items;
  }
);

export const deleteCarouselMedia = createAsyncThunk(
  "carousel/deleteCarouselMedia",
  async (id) => {
    await axios.delete(`${apiUrl}/carousel/${id}`);
    return id;
  }
);

const carouselSlice = createSlice({
  name: "carousel",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    loading: false,
  },
  reducers: {
    updateStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCarouselMedia.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getCarouselMedia.fulfilled, (state, action) => {
        state.status = "fetchData";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getCarouselMedia.rejected, (state, action) => {
        state.status = "fetchError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateCarouselOrder.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(updateCarouselOrder.fulfilled, (state, action) => {
        state.status = "updateSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(updateCarouselOrder.rejected, (state, action) => {
        state.status = "updateError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCarouselMedia.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(addCarouselMedia.fulfilled, (state, action) => {
        state.status = "addSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(addCarouselMedia.rejected, (state, action) => {
        state.status = "addError";
        state.loading = false;
        state.error = action.error.message;
      }).addCase(deleteCarouselMedia.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(deleteCarouselMedia.fulfilled, (state, action) => {
        state.status = "deleteSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(deleteCarouselMedia.rejected, (state, action) => {
        state.status = "deleteError";
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateStatus } = carouselSlice.actions;
export const selectAllCarousels = (state) => state.carousel.items;
export const getCarouselsStatus = (state) => state.carousel.status;
export const getCarouselsError = (state) => state.carousel.error;
export const getCarouselsSuccess = (state) => state.carousel.success;
export const getCarouselsLoading = (state) => state.carousel.loading;
export default carouselSlice.reducer;
