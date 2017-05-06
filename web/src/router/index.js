const PATH_REGEXP = new RegExp([
  '(\\\\.)',
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))',
].join('|'), 'g');

export function _parse(str) {
  const tokens = [];
  let index = 0;
  let path = '';
  let res;

  /*eslint-disable */
  while ((res = PATH_REGEXP.exec(str)) !== null) {
    let offset = res.index;

    path += str.slice(index, offset);
    index = offset + res[0].length;

    // if not exist path or empty string
    if (path) {
      tokens.push(path);
    }
    path = '';

    const token = {
      name: res[3],
      pattern: '[^/]+?',
    };
    tokens.push(token);
  }
  /*eslint-enable */

  if (index < str.length) {
    path += str.substr(index);
  }
  if (path) {
    tokens.push(path);
  }

  return tokens;
}

export function _tokensToRegexp(tokens) {
  let route = '';
  const lastToken = tokens[tokens.length - 1];
  const endsWithSlash = (typeof lastToken === 'string' && /\/$/.test(lastToken));

  tokens.forEach(token => {
    if (typeof token === 'string') {
      route += token;
    } else {
      let capture = token.pattern;

      capture = '/(' + capture + ')';
      route += capture;
    }
  });
  route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
  route += '$';

  return new RegExp('^' + route, 'i');
}

export function _pathToRegexp(path) {
  const tokens = _parse(path);
  const regexp = _tokensToRegexp(tokens);

  regexp.keys = [];
  tokens.forEach(token => {
    if (typeof token !== 'string') {
      regexp.keys.push(token);
    }
  });

  return regexp;
}

export function _getParams(keys, matches) {
  const params = {};

  if (matches) {
    keys.forEach((key, index) => {
      params[key.name] = matches[index + 1];
    });
  }
  return params;
}

export function _exec(regexp, path) {
  const matches = regexp.exec(path);
  const params = _getParams(regexp.keys, matches);

  if (!matches) {
    return null;
  }

  matches.params = params;
  return matches;
}

export default class Router {
  constructor(routes = []) {
    this._listeners = [];

    this._routes = routes;
    this._histories = this._load() || [];
  }

  _getRoute(path) {
    for (let i = 0; i < this._routes.length; i++) {
      const route = this._routes[i];
      const regexp = _pathToRegexp(route.path || '');
      const matches = _exec(regexp, path);
      if (matches) {
        route.params = matches.params;
        return route;
      }
    }
    return null;
  }
  _save() {
    if (typeof window === 'object' && window.localStorage) {
      window.localStorage.setItem('__router_histories', JSON.stringify(this._histories));
    }
  }
  _load() {
    if (typeof window === 'object' && window.localStorage) {
      return JSON.parse(window.localStorage.getItem('__router_histories'));
    }
  }

  push(path) {
    const route = this._getRoute(path);
    if (this._histories[this._histories.length - 1] !== (route || {}).path) {
      this._histories.push(path);
      this._save();
      this._listeners.forEach(listener => {
        const path_ = this._histories[this._histories.length - 1];
        listener(this._getRoute(path_), false);
      });
      return route;
    }
    return null;
  }

  pop() {
    if (this._histories.length < 1) {
      const popedPath = this._histories.pop();
      this._save();
      this._listeners.forEach(listener => {
        const path_ = this._histories[this._histories.length - 1];
        listener(this._getRoute(path_), true);
      });
      return popedPath;
    } else {
      const route = this.prev();
      this._histories.push(route.path);
      this._save();
      this._listeners.forEach(listener => {
        const path_ = this._histories[this._histories.length - 1];
        listener(this._getRoute(path_), true);
      });
      return route;
    }
  }

  prev() {
    const path = this._histories[this._histories.length - 2];
    return this._getRoute(path) || this._routes[0];
  }

  present() {
    const path = this._histories[this._histories.length - 1];
    return this._getRoute(path) || this._routes[0];
  }

  addChangeListener(listener) {
    this._listeners.push(listener);
  }
}
