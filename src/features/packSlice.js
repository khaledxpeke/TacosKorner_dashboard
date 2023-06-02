import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  success: null,
  loading: false,
};

export const getPack = createAsyncThunk("pack/getPack", async () => {
  try {
    const response = await axios.get(
      "http://localhost:3300/api/pack",
    );
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});

export const addPack = createAsyncThunk(
  "pack/addPack",
  async (body) => {
    try {
      const response = await axios.post(
        "http://localhost:3300/api/pack",
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

export const modifyPack = createAsyncThunk(
  "pack/modifyPack",
  async ({body,packId}) => {
    try {
      const response = await axios.put(
        `http://localhost:3300/api/pack/update/${packId}`,
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

export const deletePack= createAsyncThunk(
  "pack/deletePack",
  async (packId) => {
    try {
      const response = await axios.delete(`http://localhost:3300/api/pack/${packId}`, {
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


const packSlice = createSlice({
  name: "pack",
  initialState,
  reducers: {
    updateStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getPack.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getPack.fulfilled, (state, action) => {
        state.status = "fetchData";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getPack.rejected, (state, action) => {
        state.status = "fetchError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addPack.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(addPack.fulfilled, (state, action) => {
        state.status = "addSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(addPack.rejected, (state, action) => {
        state.status = "addError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deletePack.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(deletePack.fulfilled, (state, action) => {
        state.status = "deleteSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(deletePack.rejected, (state, action) => {
        state.status = "deleteError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(modifyPack.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(modifyPack.fulfilled, (state, action) => {
        state.status = "modifySuccess";
        state.loading = false;
        state.success = action.payload.message;
        console.log(action.payload);
      })
      .addCase(modifyPack.rejected, (state, action) => {
        state.status = "modifyError";
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { updateStatus } = packSlice.actions;
export const selectAllPack = (state) => state.pack.items;
export const getPackStatus = (state) => state.pack.status;
export const getPackError = (state) => state.pack.error;
export const getPackSuccess = (state) => state.pack.success;
export const getPackLoading = (state) => state.pack.loading;
export default packSlice.reducer;