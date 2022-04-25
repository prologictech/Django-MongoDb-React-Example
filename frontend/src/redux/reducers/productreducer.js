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
  PRODUCT_UPDATE_RESET,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
} from "../../component/Constants/ProductConstants";

/**USER REDUCERS */

// product Reducer
export const ProductReducer = (state = {}, action) => {
  switch (action.type) {
    // Request
    case PRODUCT_REQUEST:
      return { ...state, loading: true };
    // Product success
    case PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        error: null,
      };
    // product fail
    case PRODUCT_FAIL:
      return { ...state, loading: false, error: action.payload };

    // Product list request
    case PRODUCT_LIST_REQUEST:
      return { ...state, loading: true };
    // Product list success
    case PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        error: null,
      };
    // Product list fail
    case PRODUCT_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };

    // Product delete request
    case PRODUCT_DELETE_REQUEST:
      return { loading: true };
    // Product delete success
    case PRODUCT_DELETE_SUCCESS:
      return { loading: false, success: true };
    // Product delete fail
    case PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload };

    // Product update request
    case PRODUCT_UPDATE_REQUEST:
      return { loading: true };
    // Product update success
    case PRODUCT_UPDATE_SUCCESS:
      return { loading: false, success: true, product: action.payload };
    // Product update fail
    case PRODUCT_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    // Product update reset
    case PRODUCT_UPDATE_RESET:
      return { product: {} };

    // Product detail request
    case PRODUCT_DETAILS_REQUEST:
      return { loading: true, ...state };
    // Product detail success
    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload.product };
    // Product detail fail
    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
