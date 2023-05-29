import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/authSlice";
import productReducer from "./features/productSlice";
import categoriesReducer from "./features/categorySlice";

const store = configureStore({
  reducer: {
    product: productReducer,
    user:userReducer,
    categories:categoriesReducer

  },
});

export default store;