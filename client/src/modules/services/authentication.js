import config from 'config/default.json';
import { handleResponse } from "./networking";

export function login(access_token, facebook_id) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token, facebook_id })
  };

  console.log({ requestOptions });

  return fetch(`${config.apiUrl}/login`, requestOptions)
    .then(handleResponse)
    .then(user => {

      if (user.token) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      return user;
    }).catch(() => logout());
}

export function logout() {
  localStorage.removeItem('user');
}



