import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/authSlice";
import productReducer from "./features/productSlice";

const store = configureStore({
  reducer: {
    product: productReducer,
    user:userReducer
    // Add more reducers here if needed
  },
});

export default store;