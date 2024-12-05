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

export const getSettings = createAsyncThunk(
  "settings/getSettings",
  async () => {
    try {
      const response = await axios.get(`${apiUrl}/settings`, {
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

export const addSettings = createAsyncThunk(
  "settings/addSettings",
  async (body) => {
    try {
      const response = await axios.post(`${apiUrl}/settings`, body, {
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
export const updateCurrency = createAsyncThunk(
  "settings/updateCurrency",
  async (body) => {
    try {
      const response = await axios.put(`${apiUrl}/settings/currency`, body, {
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

export const modifySettings = createAsyncThunk(
  "settings/modifySettings",
  async ({ body, settingId }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/settings/update/${settingId}`,
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
export const deleteSettings = createAsyncThunk(
  "settings/deleteSettings",
  async (body) => {
    try {
      const response = await axios.delete(`${apiUrl}/settings/currency`, {
        data: body, // Attach the body inside the config
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

const settingSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getSettings.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.status = "fetchData";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.status = "fetchError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addSettings.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(addSettings.fulfilled, (state, action) => {
        state.status = "addSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(addSettings.rejected, (state, action) => {
        state.status = "addError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteSettings.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(deleteSettings.fulfilled, (state, action) => {
        state.status = "deleteSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(deleteSettings.rejected, (state, action) => {
        state.status = "deleteError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(modifySettings.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(modifySettings.fulfilled, (state, action) => {
        state.status = "modifySuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(modifySettings.rejected, (state, action) => {
        state.status = "modifyError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateCurrency.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(updateCurrency.fulfilled, (state, action) => {
        state.status = "updateSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(updateCurrency.rejected, (state, action) => {
        state.status = "updateError";
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { updateStatus } = settingSlice.actions;
export const selectAllSettings = (state) => state.settings.items;
export const getSettingsStatus = (state) => state.settings.status;
export const getSettingsError = (state) => state.settings.error;
export const getSettingsSuccess = (state) => state.settings.success;
export const getSettingsLoading = (state) => state.settings.loading;
export default settingSlice.reducer;
