/***
 * Auth actions
 */
import {
  // Login User Components
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,

  // Regiter  User Components
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  RESET_MESSAGES,

  // User Details Components
  USER_DETAILS_RESET,
} from "../../component/Constants/userConstants";

import api from "../../api";

// User Register Action
export const register = (params) => async (dispatch) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST,
    });

    // save 'data' variable for data coming from backend
    const { data } = await api.post("/auth/register/", params);

    dispatch({
      // if success
      type: USER_REGISTER_SUCCESS,
      payload: data.detail,
    });

    return true;
  } catch (error) {
    // error handling
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// Login Action
export const login = (username, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    // save 'data' variable for data coming from backend
    const { data } = await api.post(
      "/auth/login/",
      // set username to email and password to password
      { username, password }
    );

    // if success
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    // localStorage set item
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    if (error?.response?.data) {
      // error handling
      dispatch({
        type: USER_LOGIN_FAIL,

        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.response.data,
      });
    }
  }
};

// Logout Action
export const logout = () => (dispatch) => {
  // remove items from local storage when the user logs out
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
};

export const resetMessages = () => async (dispatch) => {
  dispatch({
    type: RESET_MESSAGES,
  });
};
