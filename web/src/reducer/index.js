export function reducer(state, action) {
  const newState = Object.assign({}, state);
  if (action) {
    if (action.type === '__INITIALIZE_MAIN_STORYBOARD') {
      newState.isAuthenticated = action.isAuthenticated;
    }
  }
  return newState;
}
