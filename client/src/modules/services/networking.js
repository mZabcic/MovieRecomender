export const requestOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    "Authorization": authHeader()
  },
};

export const requestOptionsPost = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    "Authorization": authHeader()
  },
};

export const requestOptionsDelete = {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    "Authorization": authHeader()
  },
};

export function authHeader() {
  let user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    return 'Bearer ' + user.token ;
  } else {
    return {};
  }
}

export function handleResponse(response) {
  console.log({ response });

  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        return error;
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
