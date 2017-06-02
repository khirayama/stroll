import cookies from 'browser-cookies';

import {STROLL_ACCESS_TOKEN_KEY} from '../constants';

export function extractAccessToken() {
  return cookies.get(STROLL_ACCESS_TOKEN_KEY) || '';
}

export function setAccessToken(accessToken) {
  cookies.set(STROLL_ACCESS_TOKEN_KEY, accessToken);
}
