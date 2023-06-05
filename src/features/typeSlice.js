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

export const getTypes = createAsyncThunk("type/getTypes", async () => {
  try {
    const response = await axios.get(
      `${apiUrl}/type`,
    );
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});

export const addType = createAsyncThunk(
  "type/addType",
  async (body) => {
    try {
      const response = await axios.post(
        `${apiUrl}/type`,
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

export const modifyType = createAsyncThunk(
  "type/modifyType",
  async ({body,typeId}) => {
    try {
      const response = await axios.put(
        `${apiUrl}/type/update/${typeId}`,
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
export const deleteType = createAsyncThunk(
  "type/deleteType",
  async (typeId) => {
    try {
      const response = await axios.delete(`${apiUrl}/type/${typeId}`, {
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


const typeSlice = createSlice({
  name: "type",
  initialState,
  reducers: {
    updateStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getTypes.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getTypes.fulfilled, (state, action) => {
        state.status = "fetchData";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getTypes.rejected, (state, action) => {
        state.status = "fetchError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addType.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(addType.fulfilled, (state, action) => {
        state.status = "addSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(addType.rejected, (state, action) => {
        state.status = "addError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteType.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(deleteType.fulfilled, (state, action) => {
        state.status = "deleteSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(deleteType.rejected, (state, action) => {
        state.status = "deleteError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(modifyType.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(modifyType.fulfilled, (state, action) => {
        state.status = "modifySuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(modifyType.rejected, (state, action) => {
        state.status = "modifyError";
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { updateStatus } = typeSlice.actions;
export const selectAllTypes = (state) => state.type.items;
export const getTypesStatus = (state) => state.type.status;
export const getTypesError = (state) => state.type.error;
export const getTypesSuccess = (state) => state.type.success;
export const getTypesLoading = (state) => state.type.loading;
export default typeSlice.reducer;