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

export const getRules = createAsyncThunk("rule/getRules", async () => {
  try {
    const response = await axios.get(
      `${apiUrl}/rule`,
    );
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});

const ruleSlice = createSlice({
    name: "rule",
    initialState,
    reducers: {
      updateStatus: (state) => {
        state.status = "idle";
      },
    },
    extraReducers(builder) {
      builder
        .addCase(getRules.pending, (state, action) => {
          state.status = "loading";
          state.loading = true;
        })
        .addCase(getRules.fulfilled, (state, action) => {
          state.status = "fetchData";
          state.loading = false;
          state.items = action.payload;
        })
        .addCase(getRules.rejected, (state, action) => {
          state.status = "fetchError";
          state.loading = false;
          state.error = action.error.message;
        })
    },
  });
  export const { updateStatus } = ruleSlice.actions;
  export const selectAllRules = (state) => state.rule.items;
  export const getRulesStatus = (state) => state.rule.status;
  export const getRulesError = (state) => state.rule.error;
  export const getRulesSuccess = (state) => state.rule.success;
  export const getRulesLoading = (state) => state.rule.loading;
  export default ruleSlice.reducer;