import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;
const initialState = {
  items: [],
  status: "idle",
  error: null,
  success: null,
  loading: false,
};

export const getVariations = createAsyncThunk("variation/getVariations", async () => {
  try {
    const response = await axios.get(`${apiUrl}/type`);
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});

export const addVariation = createAsyncThunk("variation/addVariation", async (body) => {
  try {
    const response = await axios.post(`${apiUrl}/variation`, body, {
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
});

export const modifyVariation = createAsyncThunk(
  "variation/modifyVariation",
  async ({ body, variationId }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/variation/update/${variationId}`,
        body,
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
export const deleteVariation = createAsyncThunk(
  "variation/deleteVariation",
  async (variationId) => {
    try {
      const response = await axios.delete(`${apiUrl}/variation/${variationId}`, {
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

const variationSlice = createSlice({
  name: "variation",
  initialState,
  reducers: {
    updateStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getVariations.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getVariations.fulfilled, (state, action) => {
        state.status = "fetchData";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getVariations.rejected, (state, action) => {
        state.status = "fetchError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addVariation.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(addVariation.fulfilled, (state, action) => {
        state.status = "addSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(addVariation.rejected, (state, action) => {
        state.status = "addError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteVariation.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(deleteVariation.fulfilled, (state, action) => {
        state.status = "deleteSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(deleteVariation.rejected, (state, action) => {
        state.status = "deleteError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(modifyVariation.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(modifyVariation.fulfilled, (state, action) => {
        state.status = "modifySuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(modifyVariation.rejected, (state, action) => {
        state.status = "modifyError";
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { updateStatus } = variationSlice.actions;
export const selectAllVariations = (state) => state.variation.items;
export const getVariationStatus = (state) => state.variation.status;
export const getVariationError = (state) => state.variation.error;
export const getVariationSuccess = (state) => state.variation.success;
export const getVariationLoading = (state) => state.variation.loading;
export default variationSlice.reducer;
