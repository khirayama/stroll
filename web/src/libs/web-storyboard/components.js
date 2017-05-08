import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactTransitionGroup from 'react-addons-transition-group';

import Router from './router';

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
  }
};

// Link Component
export class Link extends Component {
  constructor() {
    super();

    this.handleClick = this._handleClick.bind(this);
  }
  _handleClick(event) {
    if (window.history) {
      event.preventDefault();
      const path = this.props.href;
      window.history.pushState(null, null, path);
      this.context.move(path);
    }
  }
  render() {
    return <a href={this.props.href} onClick={this.handleClick}>{this.props.children}</a>;
  }
}
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
    if (window.history) {
      event.preventDefault();
      const path = this.context.calcBackPath();
      window.history.pushState(null, null, path);
      this.context.move(path);
    }
  }
  render() {
    const path = this.context.calcBackPath();
    return <a href={path} onClick={this.handleClick}>{this.props.children}</a>;
  }
}
BackLink.contextTypes = {
  move: PropTypes.func,
  calcBackPath: PropTypes.func,
};

// Storyboard Component
export class Storyboard extends Component {
  constructor() {
    super();

    this.setStoryboard = this._setStoryboard.bind(this);
    this.setContent = this._setContent.bind(this);
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

    const segue = this.context.segue();
    if (segue !== null) {
      switch(segue.type) {
        case 'show': {
          if (segue.from === this.props.storyboard.key) {
            style.zIndex = 1;
            contentStyle.transform = 'scale(0.9)';
            setTimeout(() => {
              contentStyle.transform = 'scale(1)';
            }, 0);
          } else if (segue.to === this.props.storyboard.key) {
            style.zIndex = 2;
            style.transform = 'translateX(100%)';
            setTimeout(() => {
              style.transform = 'translateX(0)';
            }, 0);
          }
          break;
        }
        case 'temporary': {
          if (segue.from === this.props.storyboard.key) {
            style.zIndex = 1;
            contentStyle.transform = 'scale(0.9)';
            setTimeout(() => {
              contentStyle.transform = 'scale(1)';
            }, 0);
          } else if (segue.to === this.props.storyboard.key) {
            style.zIndex = 2;
            style.transform = 'translateY(100%)';
            setTimeout(() => {
              style.transform = 'translateY(0)';
            }, 0);
          }
          break;
        }
      }
    }
  }
  _setTransitionLeaveStyle() {
    const style = this._storyboard.style;
    const contentStyle = this._content.style;
    style.pointerEvents = 'none';

    const segue = this.context.segue();
    if (segue !== null) {
      switch(segue.type) {
        case 'show': {
          if (segue.from === this.props.storyboard.key) {
            style.zIndex = 1;
            contentStyle.transform = 'scale(1)';
            setTimeout(() => {
              contentStyle.transform = 'scale(0.9)';
            }, 0);
          } else if (segue.to === this.props.storyboard.key) {
            style.zIndex = 2;
            style.transform = 'translateX(0)';
            setTimeout(() => {
              style.transform = 'translateX(100%)';
            }, 0);
          }
          break;
        }
        case 'temporary': {
          if (segue.from === this.props.storyboard.key) {
            style.zIndex = 1;
            contentStyle.transform = 'scale(1)';
            setTimeout(() => {
              contentStyle.transform = 'scale(0.9)';
            }, 0);
          } else if (segue.to === this.props.storyboard.key) {
            style.zIndex = 2;
            style.transform = 'translateY(0)';
            setTimeout(() => {
              style.transform = 'translateY(100%)';
            }, 0);
          }
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
    const segue = this.context.segue();

    return (
      <section style={style.storyboard} ref={this.setStoryboard}>
        <section style={style.storyboardContent} ref={this.setContent}>{this.props.children}</section>
      </section>
    );
  }
}
Storyboard.contextTypes = {
  segue: PropTypes.func,
};

// const router = new Router(segues, storyboards);
// <Navigator
//   path={path}
//   router={router}
// />
// Navigator Component
export class Navigator extends Component {
  getChildContext() {
    return {
      move: this.move,
      segue: () => this.state.segue,
      calcBackPath: this.calcBackPath,
    };
  }

  constructor(props) {
    super(props);

    const storyboard = this.props.router.getStoryboardByPath(props.path);

    this.state = {
      storyboardKey: storyboard.key,
      segue: null,
      initializing: false,
    };

    this.move = this._move.bind(this);
    this.calcBackPath = this._calcBackPath.bind(this);
  }

  componentDidMount() {
    window.addEventListener('popstate', () => {
      const path = location.pathname;
      setTimeout(() => {
        this._move(path);
      }, 25);
    });
  }

  _move(path) {
    const nextStoryboard = this.props.router.getStoryboardByPath(path);
    const segue = this.props.router.getSegue(this.state.storyboardKey, nextStoryboard.key);
    this.setState({
      storyboardKey: nextStoryboard.key,
      segue,
    });
  }

  _calcBackPath() {
    const storyboard = this.props.router.estimateBackStoryboard(this.state.storyboardKey);
    return storyboard.path;
  }

  render() {
    const storyboard = this.props.router.getStoryboardByKey(this.state.storyboardKey);

    return (
      <section style={style.navigator}>
        <ReactTransitionGroup>
          <Storyboard
            segue={this.state.segue}
            storyboard={storyboard}
            key={storyboard.key + new Date().getTime()}
          >{
            React.createElement(storyboard.component, Object.assign({}, this.props, {storyboard}))
          }</Storyboard>
        </ReactTransitionGroup>
      </section>
    );
  }
}
Navigator.childContextTypes = {
  move: PropTypes.func,
  segue: PropTypes.func,
  calcBackPath: PropTypes.func,
};
