import { history } from 'modules/services';
import { login, logout } from "modules/services";

export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE';

export const USER_LOGOUT = 'USER_LOGOUT';


export function loginUser(access_token, facebook_id) {
  return dispatch => {
    dispatch(request());

    login(access_token, facebook_id)
      .then(
        data => {
          dispatch(success(data));
          history.push('/');
        },
        error => {
          dispatch(failure(error));
        }
      );
  };

  function request(user) { return { type: USER_LOGIN_REQUEST } }
  function success(data) { return { type: USER_LOGIN_SUCCESS, payload: data } }
  function failure(error) { return { type: USER_LOGIN_FAILURE, error } }
}

export function logoutUser() {
  logout();
  history.push("/login");
  return { type: USER_LOGOUT };
}
