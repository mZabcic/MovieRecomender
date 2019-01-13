import { combineReducers } from "redux";
import { } from "../actions";
import { USER_LOGIN_SUCCESS, USER_LOGOUT } from "../actions/authentication";
import { FETCH_USER_SUCCESS } from "../actions/user";

function userReducer(state = {}, action) {
  switch (action.type) {
    case USER_LOGIN_SUCCESS:
      return action.payload.user;
    case USER_LOGOUT:
      return {};
    case FETCH_USER_SUCCESS:
      return { ...state, ...action.payload.user };
    default:
      return state;
  }
}

function tokenReducer(state = {}, action) {
  switch (action.type) {
    case USER_LOGIN_SUCCESS:
      return action.payload.token;
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
}

export default combineReducers({ userReducer, tokenReducer });
