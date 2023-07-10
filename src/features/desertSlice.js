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

export const getDeserts = createAsyncThunk("desert/getDeserts", async () => {
  try {
    const response = await axios.get(
      `${apiUrl}/desert`,
    );
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});
export const addDesert = createAsyncThunk(
  "desert/addDesert",
  async (body) => {
    try {
      const response = await axios.post(
        `${apiUrl}/desert`,
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

export const modifyDesert = createAsyncThunk(
  "desert/modifyDesert",
  async ({body,desertId}) => {
    try {
      const response = await axios.put(
        `${apiUrl}/desert/update/${desertId}`,
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
export const deleteDesert= createAsyncThunk(
  "desert/deleteDesert",
  async (desertId) => {
    try {
      const response = await axios.delete(`${apiUrl}/desert/${desertId}`, {
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


const desertSlice = createSlice({
  name: "desert",
  initialState,
  reducers: {
    updateStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getDeserts.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getDeserts.fulfilled, (state, action) => {
        state.status = "fetchData";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getDeserts.rejected, (state, action) => {
        state.status = "fetchError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addDesert.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(addDesert.fulfilled, (state, action) => {
        state.status = "addSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(addDesert.rejected, (state, action) => {
        state.status = "addError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteDesert.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(deleteDesert.fulfilled, (state, action) => {
        state.status = "deleteSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(deleteDesert.rejected, (state, action) => {
        state.status = "deleteError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(modifyDesert.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(modifyDesert.fulfilled, (state, action) => {
        state.status = "modifySuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(modifyDesert.rejected, (state, action) => {
        state.status = "modifyError";
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { updateStatus } = desertSlice.actions;
export const selectAllDeserts = (state) => state.desert.items;
export const getDesertsStatus = (state) => state.desert.status;
export const getDesertsError = (state) => state.desert.error;
export const getDesertsSuccess = (state) => state.desert.success;
export const getDesertsLoading = (state) => state.desert.loading;
export default desertSlice.reducer;