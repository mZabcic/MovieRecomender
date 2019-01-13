import {
  combineReducers
} from 'redux';
import auth from "./auth";

function placeholder(state = {}, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default combineReducers({ placeholder, auth });
