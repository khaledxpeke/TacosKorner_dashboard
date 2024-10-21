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

export const getDrinks = createAsyncThunk("drink/getDrinks", async () => {
  try {
    const response = await axios.get(`${apiUrl}/drink`);
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});

export const addDrink = createAsyncThunk("drink/addDrink", async (body) => {
  try {
    const response = await axios.post(`${apiUrl}/drink`, body, {
      headers: {
        Authorization: `Bearer ${localStorage
          .getItem("token")
          .replace(/^"|"$/g, "")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});

export const modifyDrink = createAsyncThunk(
  "drink/modifyDrink",
  async ({ body, drinkId }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/drink/update/${drinkId}`,
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

export const deleteDrink = createAsyncThunk(
  "drink/deleteDrink",
  async (drinkId) => {
    try {
      const response = await axios.delete(`${apiUrl}/drink/${drinkId}`, {
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
const drinkSlice = createSlice({
  name: "drink",
  initialState,
  reducers: {
    updateStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getDrinks.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getDrinks.fulfilled, (state, action) => {
        state.status = "fetchData";
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getDrinks.rejected, (state, action) => {
        state.status = "fetchError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addDrink.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(addDrink.fulfilled, (state, action) => {
        state.status = "addSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(addDrink.rejected, (state, action) => {
        state.status = "addError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteDrink.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(deleteDrink.fulfilled, (state, action) => {
        state.status = "deleteSuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(deleteDrink.rejected, (state, action) => {
        state.status = "deleteError";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(modifyDrink.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(modifyDrink.fulfilled, (state, action) => {
        state.status = "modifySuccess";
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(modifyDrink.rejected, (state, action) => {
        state.status = "modifyError";
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { updateStatus } = drinkSlice.actions;
export const selectAllDrinks = (state) => state.drink.items;
export const getDrinksStatus = (state) => state.drink.status;
export const getDrinksError = (state) => state.drink.error;
export const getDrinksSuccess = (state) => state.drink.success;
export const getDrinksLoading = (state) => state.drink.loading;
export default drinkSlice.reducer;
