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

export const getExtra = createAsyncThunk("extra/getExtra", async () => {
  try {
    const response = await axios.get(
      `${apiUrl}/extra`,
    );
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});

export const addExtra = createAsyncThunk(
  "extra/addExtra",
  async (body) => {
    try {
      const response = await axios.post(
        `${apiUrl}/extra`,
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

export const modifyExtra = createAsyncThunk(
  "extra/modifyExtra",
  async ({body,extraId}) => {
    try {
      const response = await axios.put(
        `${apiUrl}/extra/update/${extraId}`,
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

export const deleteExtra= createAsyncThunk(
  "extra/deleteExtra",
  async (extraId) => {
    try {
      const response = await axios.delete(`${apiUrl}/extra/${extraId}`, {
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


const extraSlice = createSlice({
  name: "extra",
  initialState,
  reducers: {
    updateStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getExtra.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getExtra.fulfilled, (state, action) => {
        state.status = "fetchData";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getExtra.rejected, (state, action) => {
        state.status = "fetchError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addExtra.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(addExtra.fulfilled, (state, action) => {
        state.status = "addSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(addExtra.rejected, (state, action) => {
        state.status = "addError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteExtra.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(deleteExtra.fulfilled, (state, action) => {
        state.status = "deleteSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(deleteExtra.rejected, (state, action) => {
        state.status = "deleteError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(modifyExtra.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(modifyExtra.fulfilled, (state, action) => {
        state.status = "modifySuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(modifyExtra.rejected, (state, action) => {
        state.status = "modifyError";
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { updateStatus } = extraSlice.actions;
export const selectAllExtra = (state) => state.extra.items;
export const getExtraStatus = (state) => state.extra.status;
export const getExtraError = (state) => state.extra.error;
export const getExtraSuccess = (state) => state.extra.success;
export const getExtraLoading = (state) => state.extra.loading;
export default extraSlice.reducer;