import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  success: null,
  loading: false,
};

export const getSupplements = createAsyncThunk("supplement/getSupplements", async () => {
  try {
    const response = await axios.get(
      "http://localhost:3300/api/supplement",
    );
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});
export const addSupplement = createAsyncThunk(
  "supplement/addSupplement",
  async (body) => {
    try {
      const response = await axios.post(
        "http://localhost:3300/api/supplement",
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
export const deleteSupplement= createAsyncThunk(
  "supplement/deleteSupplement",
  async (supplementId) => {
    try {
      const response = await axios.delete(`http://localhost:3300/api/supplement/${supplementId}`, {
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


const supplementSlice = createSlice({
  name: "supplement",
  initialState,
  reducers: {
    updateStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getSupplements.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getSupplements.fulfilled, (state, action) => {
        state.status = "fetchData";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getSupplements.rejected, (state, action) => {
        state.status = "fetchError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addSupplement.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(addSupplement.fulfilled, (state, action) => {
        state.status = "addSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(addSupplement.rejected, (state, action) => {
        state.status = "addError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteSupplement.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(deleteSupplement.fulfilled, (state, action) => {
        state.status = "deleteSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(deleteSupplement.rejected, (state, action) => {
        state.status = "deleteError";
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { updateStatus } = supplementSlice.actions;
export const selectAllSupplements = (state) => state.supplement.items;
export const getSupplementsStatus = (state) => state.supplement.status;
export const getSupplementsError = (state) => state.supplement.error;
export const getSupplementsSuccess = (state) => state.supplement.success;
export const getSupplementsLoading = (state) => state.supplement.loading;
export default supplementSlice.reducer;