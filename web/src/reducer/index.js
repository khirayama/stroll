export function reducer(state, action) {
  const newState = Object.assign({}, state);
  if (action) {
    switch (action.type) {
      case '__INITIALIZE_MAIN_STORYBOARD': {
        newState.isAuthenticated = action.isAuthenticated;
        break;
      }
      case '__INITIALIZE_PROFILE_STORYBOARD': {
        newState.isAuthenticated = action.isAuthenticated;
        break;
      }
      default: {
        break;
      }
    }
  }
  return newState;
}
