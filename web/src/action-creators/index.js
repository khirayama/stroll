import {LoginStatus} from '../repositories';
import {Token} from '../repositories';

export function initializeMainStoryboard(params, args, payload) {
  return new Promise(resolve => {
    LoginStatus.get(payload.accessToken).then(({status}) => {
      const action = {
        type: '__INITIALIZE_MAIN_STORYBOARD',
        isAuthenticated: (status === 'connected'),
      };
      payload.dispatch(action);
      resolve();
    });
  });
}

export function initializeProfileStoryboard(params, args, payload) {
  return new Promise(resolve => {
    LoginStatus.get(payload.accessToken).then(({status}) => {
      const action = {
        type: '__INITIALIZE_PROFILE_STORYBOARD',
        isAuthenticated: (status === 'connected'),
      };
      payload.dispatch(action);
      resolve();
    });
  });
}

export function createToken(params) {
  return new Promise(resolve => {
    Token.create(params).then(({accessToken}) => {
      resolve(accessToken);
    });
  });
}
