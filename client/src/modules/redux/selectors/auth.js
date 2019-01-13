export function getUser(state) {
  const authState = state.auth;

  return authState.userReducer;
}

export function getToken(state) {
  const authState = state.auth;

  return authState.tokenReducer;
}
