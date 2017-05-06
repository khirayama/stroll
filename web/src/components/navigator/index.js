import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactTransitionGroup from 'react-addons-transition-group';

const style = {
  navigator: {
    width: '100%',
    height: '100%',
  },
  scene: {
    width: '100%',
    height: '100%',
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

const TRANSITION_TIME = 3000;

export class Scene extends Component {
  componentWillAppear(callback) {
    console.log('componentWillAppear');
    setTimeout(callback, TRANSITION_TIME);
  }
  componentDidAppear() {
    console.log('componentDidAppear');
  }
  componentWillEnter(callback) {
    console.log('componentWillEnter');
    setTimeout(callback, TRANSITION_TIME);
  }
  componentDidEnter() {
    console.log('componentDidEnter');
  }
  componentWillLeave(callback) {
    console.log('componentWillLeave');
    setTimeout(callback, TRANSITION_TIME);
  }
  componentDidLeave() {
    console.log('componentDidLeave');
  }
  render() {
    return <section style={style.scene}>{this.props.children}</section>;
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
