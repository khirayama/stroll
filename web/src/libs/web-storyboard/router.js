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
  constructor(segues = [], storyboards = []) {
    this._segues = segues;
    this._storyboards = storyboards;
  }

  getRootStoryboard() {
    for (let i = 0; i < this._storyboards.length; i++) {
      const storyboard = this._storyboards[i];
      if (storyboard.root) {
        return storyboard;
      }
    }
    return this._storyboards[0];
  }

  getStoryboardByPath(path) {
    for (let i = 0; i < this._storyboards.length; i++) {
      const storyboard = this._storyboards[i];
      const regexp = _pathToRegexp(storyboard.path || '');
      const matches = _exec(regexp, path);
      if (matches) {
        storyboard.params = matches.params;
        return storyboard;
      }
    }
    return null;
  }

  getStoryboardByKey(storyboardKey) {
    for (let i = 0; i < this._storyboards.length; i++) {
      const storyboard = this._storyboards[i];
      if (storyboard.key === storyboardKey) {
        return storyboard;
      }
    }
    return null;
  }

  estimateBackStoryboard(currentStoryboardKey) {
    const candidateSegues = this._segues.filter(segue => {
      return (segue.to === currentStoryboardKey);
    });
    if (candidateSegues.length === 1) {
      return this.getStoryboardByKey(candidateSegues[0].from);
    } else {
      for (let i = 0; i < this._storyboards.length; i++) {
        const storyboard = this._storyboards[i];
        if (storyboard.root) {
          return storyboard;
        }
      }
      return null;
    }
  }

  getSegue(fromStoryboardKey, toStoryboardKey) {
    for (let i = 0; i < this._segues.length; i++) {
      const segue = this._segues[i];
      // if (segue.from === fromStoryboardKey && segue.to === toStoryboardKey) {
      //   return segue;
      // }
      if (
        (segue.from === fromStoryboardKey && segue.to === toStoryboardKey) ||
        (segue.from === toStoryboardKey && segue.to === fromStoryboardKey)
      ) {
        return segue;
      }
    }
    return null;
  }

  _callArgs(args) {
    let args_ = args;
    return new Promise(resolve => {
      if (typeof args === 'function') {
        args_ = args();
        // Promise
        if (args_.then) {
          args_.then(args__ => {
            resolve(args__);
          });
        } else {
          resolve(args_);
        }
      } else {
        resolve(args_);
      }
    });
  }

  _callInitialize(initialize, params, args) {
    const initialize_ = initialize || (() => null);

    return new Promise(resolve => {
      const init = initialize_(params, args);

      if (init && init.then) {
        init.then(result_ => {
          resolve(result_);
        });
      } else {
        resolve(init);
      }
    });
  }

  _callTitle(title, value) {
    let title_ = title;
    return new Promise(resolve => {
      if (typeof title === 'function') {
        title_ = title(value);
        // Promise
        if (title_.then) {
          title_.then(title__ => {
            resolve(title__);
          });
        } else {
          resolve(title_);
        }
      } else {
        resolve(title_);
      }
    });
  }

  initialize(path) {
    return new Promise(resolve => {
      const storyboard = this.getStoryboardByPath(path);
      const options = storyboard.options || {};
      const result = {};

      this._callArgs(options.args).then(args => {
        this._callInitialize(options.initialize, storyboard.params, args).then(value => {
          result.value = value;
          this._callTitle(options.title, value).then(title => {
            result.title = title;
            resolve(result);
          });
        });
      });
    });
  }
}
