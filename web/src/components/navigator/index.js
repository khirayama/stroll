import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactTransitionGroup from 'react-addons-transition-group';

const style = {
  navigator: {
    width: '100%',
    height: '100%',
    position: 'fixed',
    top: '0',
    left: '0',
  },
  scene: {
    width: '100%',
    height: '100%',
    background: 'red',
    display: 'inline-block',
    position: 'absolute',
    top: '0',
    left: '0',
  },
};

export class BackLink extends Component {
  constructor() {
    super();

    this.handleClick = this._handleClick.bind(this);
  }
  _handleClick(event) {
    event.preventDefault();
    this.context.router.pop();
  }
  render() {
    const route = this.context.router.prev();
    const href = route.path;
    return <a href={href} onClick={this.handleClick}>{this.props.children}</a>;
  }
}
BackLink.contextTypes = {
  router: PropTypes.object,
};

export class Link extends Component {
  constructor() {
    super();

    this.handleClick = this._handleClick.bind(this);
  }
  _handleClick(event) {
    event.preventDefault();
    this.context.router.push(this.props.href);
  }
  render() {
    return <a href={this.props.href} onClick={this.handleClick}>{this.props.children}</a>;
  }
}
Link.contextTypes = {
  router: PropTypes.object,
};

const TRANSITION_TIME = 600;

export class Scene extends Component {
  constructor() {
    super();

    this.setRef = this._setRef.bind(this);
  }
  componentWillEnter(callback) {
    // console.log('componentWillEnter');
    this._scene.style.pointerEvents = 'none';
    setTimeout(callback, TRANSITION_TIME);
  }
  componentDidEnter() {
    // console.log('componentDidEnter');
    this._scene.style.pointerEvents = 'auto';
  }
  componentWillLeave(callback) {
    // console.log('componentWillLeave');
    this._scene.style.pointerEvents = 'none';
    setTimeout(callback, TRANSITION_TIME);
  }
  componentDidLeave() {
    // console.log('componentDidLeave');
    this._scene.style.pointerEvents = 'auto';
  }
  _setRef(scene) {
    this._scene = scene;
  }
  render() {
    // console.log('render scene');
    return <section style={style.scene} ref={this.setRef}>{this.props.children}</section>;
  }
}

export default class Navigator extends Component {
  getChildContext() {
    return {router: this.props.router};
  }

  constructor(props) {
    super(props);

    this.state = {
      route: props.router.present(),
    };
  }

  componentDidMount() {
    this.props.router.addChangeListener((route, isPop) => {
      if (route) {
        if (isPop) {
          window.history.replaceState(null, null, route.path);
        } else {
          window.history.pushState(null, null, route.path);
        }
        document.title = route.title;
        this.setState({route});
      }
    });

    if (window.history) {
      window.addEventListener('popstate', event => {
        this.props.router.pop(location.pathname);
      });
    }
  }

  render() {
    const route = this.state.route;
    const element = React.createElement(route.component, route.props);

    return (
      <section style={style.navigator}>
        <ReactTransitionGroup>
          <Scene key={route.key}>{React.createElement(route.component, Object.assign({}, this.props, {route}))}</Scene>
        </ReactTransitionGroup>
      </section>
    );
  }
}
Navigator.childContextTypes = {
  router: PropTypes.object,
};
