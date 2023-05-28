import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./reducers/productReducer";
import userReducer from "./features/authSlice";

const store = configureStore({
  reducer: {
    products: productReducer,
    user:userReducer
    // Add more reducers here if needed
  },
});

export default store;