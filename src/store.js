import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./reducers/productReducer";
import userReducer from "./features/authSlice";
import categoriesReducer from "./features/categorySlice";

const store = configureStore({
  reducer: {
    products: productReducer,
    user:userReducer,
    categories:categoriesReducer
  },
});

export default store;