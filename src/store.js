import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/authSlice";
import productReducer from "./features/productSlice";
import supplementReducer from "./features/supplementSlice";
import categoriesReducer from "./features/categorySlice";
import ingrediantReducer from "./features/ingrediantSlice";
import typeReducer from "./features/typeSlice";
import packReducer from "./features/packSlice";
import desertReducer from "./features/desertSlice";

const store = configureStore({
  reducer: {
    product: productReducer,
    supplement: supplementReducer,
    ingrediant: ingrediantReducer,
    pack: packReducer,
    desert: desertReducer,
    type: typeReducer,
    user:userReducer,
    categories:categoriesReducer

  },
});

export default store;