import {
  combineReducers
} from 'redux';

function placeholderReducer(state = {}, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default combineReducers(placeholderReducer);
