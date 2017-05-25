import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactTransitionGroup from 'react-addons-transition-group';

// Link
// BackLink
// Storyboard
// Navigator

const TRANSITION_TIME = 550;
const EASE_IN_OUT = 'cubic-bezier(0.19, 1, 0.32, 1)';

// Style
const style = {
  navigator: {
    width: '100%',
    height: '100%',
    position: 'fixed',
    top: '0',
    left: '0',
  },
  storyboard: {
    display: 'inline-block',
    width: '100%',
    height: '100%',
    background: '#fff',
    position: 'absolute',
    top: '0',
    left: '0',
    boxShadow: '0 0 2px rgba(0, 0, 0, .4)',
    willChange: 'transform',
    transition: `transform ${TRANSITION_TIME}ms ${EASE_IN_OUT}`,
  },
  storyboardContent: {
    display: 'inline-block',
    width: '100%',
    height: '100%',
    willChange: 'transform',
    transition: `transform ${TRANSITION_TIME}ms ${EASE_IN_OUT}`,
  },
};

function isBrowser() {
  return typeof window === 'object';
}

// Link Component
export class Link extends Component {
  constructor() {
    super();

    this.handleClick = this._handleClick.bind(this);
  }

  _handleClick(event) {
    if (isBrowser() && window.history && !event.metaKey) {
      event.preventDefault();
      const path = this.props.href;
      this.context.move(path);
    }
  }

  render() {
    return <a href={this.props.href} onClick={this.handleClick}>{this.props.children}</a>;
  }
}
Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
Link.contextTypes = {
  move: PropTypes.func,
};

// BackLink Component
export class BackLink extends Component {
  constructor() {
    super();

    this.handleClick = this._handleClick.bind(this);
  }
  _handleClick(event) {
    if (isBrowser() && window.history && !event.metaKey) {
      event.preventDefault();
      const path = this.context.calcBackPath();
      this.context.move(path);
    }
  }
  render() {
    const path = this.context.calcBackPath();
    return <a href={path} onClick={this.handleClick}>{this.props.children}</a>;
  }
}
BackLink.propTypes = {
  children: PropTypes.node.isRequired,
};
BackLink.contextTypes = {
  move: PropTypes.func,
  isPush: PropTypes.func,
  calcBackPath: PropTypes.func,
};

// Storyboard Component
export class Storyboard extends Component {
  constructor(props) {
    super(props);

    this.setStoryboard = this._setStoryboard.bind(this);
    this.setContent = this._setContent.bind(this);
    this.initialize = props.router.initialize.bind(props.router);
  }
  componentWillEnter(callback) {
    this._setTransitionEnterStyle();
    setTimeout(callback, TRANSITION_TIME);
  }
  componentDidEnter() {
    this._resetTransitionStyle();
  }
  componentWillLeave(callback) {
    this._setTransitionLeaveStyle();
    setTimeout(callback, TRANSITION_TIME);
  }
  _setStoryboard(storyboard) {
    this._storyboard = storyboard;
  }
  _setContent(content) {
    this._content = content;
  }
  _setTransitionEnterStyle() {
    const style = this._storyboard.style;
    const contentStyle = this._content.style;
    style.pointerEvents = 'none';

    const isBack = this.context.isBack();
    const segue = this.context.getSegue(isBack);
    if (segue !== null) {
      switch (segue.type) {
        case 'show': {
          if (isBack) {
            style.zIndex = 1;
            contentStyle.transform = 'scale(0.9)';
            setTimeout(() => {
              contentStyle.transform = 'scale(1)';
            }, 0);
          } else {
            style.zIndex = 2;
            style.transform = 'translateX(100%)';
            setTimeout(() => {
              style.transform = 'translateX(0)';
            }, 0);
          }
          break;
        }
        case 'temporary': {
          if (isBack) {
            style.zIndex = 1;
            contentStyle.transform = 'scale(0.9)';
            setTimeout(() => {
              contentStyle.transform = 'scale(1)';
            }, 0);
          } else {
            style.zIndex = 2;
            style.transform = 'translateY(100%)';
            setTimeout(() => {
              style.transform = 'translateY(0)';
            }, 0);
          }
          break;
        }
        default: {
          break;
        }
      }
    }
  }
  _setTransitionLeaveStyle() {
    const style = this._storyboard.style;
    const contentStyle = this._content.style;
    style.pointerEvents = 'none';

    const isBack = this.context.isBack();
    const segue = this.context.getSegue(isBack);
    if (segue !== null) {
      switch (segue.type) {
        case 'show': {
          if (isBack) {
            style.zIndex = 2;
            style.transform = 'translateX(0)';
            setTimeout(() => {
              style.transform = 'translateX(100%)';
            }, 0);
          } else {
            style.zIndex = 1;
            contentStyle.transform = 'scale(1)';
            setTimeout(() => {
              contentStyle.transform = 'scale(0.9)';
            }, 0);
          }
          break;
        }
        case 'temporary': {
          if (isBack) {
            style.zIndex = 2;
            style.transform = 'translateY(0)';
            setTimeout(() => {
              style.transform = 'translateY(100%)';
            }, 0);
          } else {
            style.zIndex = 1;
            contentStyle.transform = 'scale(1)';
            setTimeout(() => {
              contentStyle.transform = 'scale(0.9)';
            }, 0);
          }
          break;
        }
        default: {
          break;
        }
      }
    }
  }
  _resetTransitionStyle() {
    const style = this._storyboard.style;

    style.pointerEvents = 'auto';
    style.zIndex = 'auto';
    style.transform = 'none';
  }
  render() {
    const props = Object.assign({
      initialize: this.initialize,
    }, this.props);
    const element = React.createElement(this.props.component, props);

    return (
      <section
        ref={this.setStoryboard}
        style={style.storyboard}
        >
        <section
          ref={this.setContent}
          style={style.storyboardContent}
          >{element}</section>
      </section>
    );
  }
}
Storyboard.propTypes = {
  router: PropTypes.shape({
    initialize: PropTypes.func.isRequired,
  }).isRequired,
  component: PropTypes.func.isRequired,
};
Storyboard.contextTypes = {
  isBack: PropTypes.func,
  getSegue: PropTypes.func,
};

// Const router = new Router(segues, storyboards);
// <Navigator
//   path={path}
//   router={router}
// />
// Navigator Component
//
// historiesを管理する
// currentはhistoriesから拾えるように
// history = {
//  path,
//  storyboardKey,
//  segue,
// };
export class Navigator extends Component {
  getChildContext() {
    return {
      move: this._move.bind(this),
      isBack: () => this._nav.isBack,
      getSegue: this._getSegue.bind(this),
      calcBackPath: this._calcBackPath.bind(this),
    };
  }

  constructor(props) {
    super(props);

    this._nav = this._loadNav(props.path);

    // Reset: root storyboard || currentHistory.path !== path || currentBrowserHistory.length !== window.history.length
    if (
      this.props.router.isRootStoryboard(props.path) ||
      (this._getCurrentHistory() && this._getCurrentHistory().path !== props.path) ||
      (isBrowser() && this._nav.browserHistorylength !== window.history.length)
    ) {
      this._resetNav();
    }
    const currentHistory = this._getCurrentHistory();
    if (
      !currentHistory ||
      (currentHistory.path !== props.path)
    ) {
      this._pushHistory(props.path);
    }

    this.state = {
      nav: this._nav,
    };
  }

  componentDidMount() {
    window.addEventListener('popstate', () => {
      const path = window.location.pathname;
      const nextHistory = this._getNextHistory();
      if (nextHistory && nextHistory.path === path) {
        this._forward();
      } else {
        this._back();
      }
      this.setState({nav: this._nav});
    });
  }

  _loadNav() {
    if (isBrowser() && window.sessionStorage) {
      const nav = JSON.parse(window.sessionStorage.getItem('__web_storyboard_nav'));
      if (nav) {
        nav.histories = nav.histories.map(history => {
          history.storyboard = this.props.router.getStoryboardByKey(history.storyboard.key);
          return history;
        });
        return nav;
      }
    }
    return {
      isBack: false,
      currentIndex: -1,
      histories: [],
      browserHistorylength: (isBrowser()) ? window.history.length : 0,
    };
  }

  _resetNav() {
    this._nav = {
      isBack: false,
      currentIndex: -1,
      histories: [],
      browserHistorylength: (isBrowser()) ? window.history.length : 0,
    };
  }

  _saveNav() {
    if (isBrowser() && window.sessionStorage) {
      window.sessionStorage.setItem('__web_storyboard_nav', JSON.stringify(this._nav));
    }
  }

  _pushHistory(path) {
    const nextStoryboard = this.props.router.getStoryboardByPath(path);

    const currentHistory = this._getCurrentHistory();
    const segue = (currentHistory === null) ? null : this.props.router.getSegue(currentHistory.storyboard.key, nextStoryboard.key);
    this._nav.histories.splice(this._nav.currentIndex + 1, this._nav.histories.length);

    this._nav.isBack = false;
    this._nav.currentIndex += 1;
    this._nav.histories.push({
      storyboard: nextStoryboard,
      segue,
      path,
    });
    this._nav.browserHistorylength = (isBrowser()) ? window.history.length : 0;

    this._saveNav();
  }

  _getPrevHistory() {
    return this._nav.histories[this._nav.currentIndex - 1] || null;
  }

  _getCurrentHistory() {
    return this._nav.histories[this._nav.currentIndex] || null;
  }

  _getNextHistory() {
    return this._nav.histories[this._nav.currentIndex + 1] || null;
  }

  _getSegue(isBack) {
    return (isBack) ? this._getNextHistory().segue : this._getCurrentHistory().segue;
  }

  _move(path) {
    const prevHistory = this._getPrevHistory();
    if (prevHistory && prevHistory.path === path) {
      window.history.back();
    } else {
      window.history.pushState(null, null, path);
      this._pushHistory(path);
      this.setState({nav: this._nav});
    }
  }

  _forward() {
    if (this._nav.currentIndex < this._nav.histories.length) {
      this._nav.isBack = false;
      this._nav.currentIndex += 1;
      this._saveNav();
    }
  }

  _back() {
    if (this._nav.currentIndex > -1) {
      this._nav.isBack = true;
      this._nav.currentIndex -= 1;
      this._saveNav();
    }
  }

  _calcBackPath() {
    const prevHistory = this._getPrevHistory();
    if (prevHistory) {
      return prevHistory.path;
    }
    return this.props.router.getRootStoryboard().path;
  }

  render() {
    const history = this._getCurrentHistory();
    const storyboard = history.storyboard;

    return (
      <section style={style.navigator}>
        <ReactTransitionGroup>
          <Storyboard
            {...this.props}
            key={storyboard.key + new Date().getTime()}
            component={storyboard.component}
            router={this.props.router}
            />
        </ReactTransitionGroup>
      </section>
    );
  }
}
Navigator.propTypes = {
  path: PropTypes.string.isRequired,
  router: PropTypes.shape({
    isRootStoryboard: PropTypes.func.isRequired,
    getStoryboardByKey: PropTypes.func.isRequired,
    getStoryboardByPath: PropTypes.func.isRequired,
    getRootStoryboard: PropTypes.func.isRequired,
    getSegue: PropTypes.func.isRequired,
  }).isRequired,
};
Navigator.childContextTypes = {
  move: PropTypes.func,
  isBack: PropTypes.func,
  getSegue: PropTypes.func,
  calcBackPath: PropTypes.func,
};
