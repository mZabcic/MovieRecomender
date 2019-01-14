import { handleResponse, authHeader } from "./networking";
import config from 'config/default.json';

export const User = { fetchUser };


function fetchUser() {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": authHeader()
    },
  };

  return fetch(`${config.apiUrl}/users/me`, requestOptions)
    .then(handleResponse)
    .then(user => {
      return user;
    });
}
