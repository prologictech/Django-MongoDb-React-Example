import {
  PRODUCT_FAIL,
  PRODUCT_REQUEST,
  PRODUCT_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
} from "../../component/Constants/ProductConstants";

import api from "../../api";

// Product Action
export const ProductAdd = (params) => async (dispatch) => {
  try {
    dispatch({
      type: PRODUCT_REQUEST,
    });

    // save 'data' variable for data coming from backend
    const { data } = await api.post(
      "/products/",

      params
    );

    // if success
    dispatch({
      type: PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    if (error?.response?.data) {
      // error handling
      dispatch({
        type: PRODUCT_FAIL,

        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.response.data,
      });
    }
  }
};

// ProductListing action
export const ProductList = (params) => async (dispatch) => {
  try {
    dispatch({
      type: PRODUCT_LIST_REQUEST,
    });

    // get 'data' variable for data coming from backend
    const { data } = await api.get("/products/");

    // if success
    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    if (error?.response?.data) {
      // error handling
      dispatch({
        type: PRODUCT_LIST_FAIL,

        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.response.data,
      });
    }
  }
};

// deleting the product
export const deleteProduct = (productId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_DELETE_REQUEST,
    });

    // delete 'data' variable for data coming from backend
    const { data } = await api.delete(`/products/${productId}/`);
    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
      payload: data,
    });

    dispatch(ProductList());
  } catch (error) {
    dispatch({
      // error handling
      type: PRODUCT_DELETE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// update the product
export const updateProduct =
  (productId, params) => async (dispatch, getState) => {
    try {
      dispatch({
        type: PRODUCT_UPDATE_REQUEST,
      });

      //  update 'data' variable for data coming from backend
      const { data } = await api.put(`/products/${productId}/`, params);
      dispatch({
        type: PRODUCT_UPDATE_SUCCESS,
        payload: data,
      });
      dispatch({
        type: PRODUCT_DETAILS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_UPDATE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

// get the product list details
export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    //  get 'data' variable for data coming from backend
    const { data } = await api.get(`/products/${id}/`);
    dispatch({
      // if success
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
