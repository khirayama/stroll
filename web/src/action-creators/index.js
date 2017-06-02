import {LoginStatus} from '../repositories';

export function initializeMainStoryboard(params, args, payload) {
  return new Promise(resolve => {
    LoginStatus.get(payload.accessToken).then(({status}) => {
      const action = {
        type: '__INITIALIZE_MAIN_STORYBOARD',
        isAuthenticated: (status === 'connected'),
      };
      resolve(action);
    });
  });
}
