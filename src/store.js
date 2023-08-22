import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/authSlice";
import productReducer from "./features/productSlice";
import supplementReducer from "./features/supplementSlice";
import categoriesReducer from "./features/categorySlice";
import ingrediantReducer from "./features/ingrediantSlice";
import drinkReducer from "./features/drinkSlice";
import typeReducer from "./features/typeSlice";
import extraReducer from "./features/extraSlice";
import desertReducer from "./features/desertSlice";
import historyReducer from "./features/historySlice";

const store = configureStore({
  reducer: {
    product: productReducer,
    supplement: supplementReducer,
    ingrediant: ingrediantReducer,
    drink: drinkReducer,
    extra: extraReducer,
    desert: desertReducer,
    type: typeReducer,
    user: userReducer,
    categories: categoriesReducer,
    history: historyReducer,
  },
});

export default store;
