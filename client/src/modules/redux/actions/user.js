import { User } from "modules/services";

export const FETCH_USER_REQUEST = "FETCH_USER_REQUEST";
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
export const FETCH_USER_ERROR = "FETCH_USER_ERROR";

export function fetchUser() {
  return dispatch => {
    request();

    User.fetchUser()
      .then(
        data => {
          dispatch(success(data));
        },
        error => {
          dispatch(error(error));
        }
      );
  }


  function request() { return { type: FETCH_USER_REQUEST } }
  function success(user) { return { type: FETCH_USER_SUCCESS, payload: user} }
  function error(error) { return { type: FETCH_USER_ERROR, error } }
}
