import axios from "axios";
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
} from "../constants/actionTypes";

export const fetchProductsRequest = () => {
  return {
    type: FETCH_PRODUCTS_REQUEST,
  };
};

export const fetchProductsSuccess = (products) => {
  console.log("Fetched products:", products);
  return {
    type: FETCH_PRODUCTS_SUCCESS,
    payload: products,
  };
};

export const fetchProductsFailure = (error) => {
  return {
    type: FETCH_PRODUCTS_FAILURE,
    payload: error,
  };
};

export const fetchProducts = () => {
  return async (dispatch) => {
    dispatch(fetchProductsRequest());
    try {
      const response = await axios.get("http://localhost:3300/api/product");
      const data = response.data;
      dispatch(fetchProductsSuccess(data));
    } catch (error) {
      dispatch(fetchProductsFailure(error.message));
    }
  };
};