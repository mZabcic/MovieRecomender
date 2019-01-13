import { history } from 'modules/services';
import { login, logout } from "modules/services";

export const userConstants = {
  USER_LOGIN_REQUEST: 'USER_LOGIN_REQUEST',
  USER_LOGIN_SUCCESS: 'USER_LOGIN_SUCCESS',
  USER_LOGIN_FAILURE: 'USER_LOGIN_FAILURE',

  USER_LOGOUT: 'USER_LOGOUT',
};

export function loginUser(access_token, facebook_id) {
  return dispatch => {
    dispatch(request());

    login(access_token, facebook_id)
      .then(
        user => {
          dispatch(success(user));
          history.push('/');
        },
        error => {
          dispatch(failure(error));
        }
      );
  };

  function request(user) { return { type: userConstants.USER_LOGIN_REQUEST } }
  function success(user) { return { type: userConstants.USER_LOGIN_SUCCESS, payload: user.user } }
  function failure(error) { return { type: userConstants.USER_LOGIN_FAILURE, error } }
}

export function logoutUser() {
  logout();
  history.push("/login");
  return { type: userConstants.USER_LOGOUT };
}
