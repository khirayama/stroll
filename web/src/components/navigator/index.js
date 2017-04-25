import React, {Component} from 'react';
import PropTypes from 'prop-types';

const style = {
  navigator: {
    width: '100%',
    height: '100%',
  },
  page: {
    width: '100%',
    height: '100%',
  },
};

export class Link extends Component {
  constructor() {
    super();

    this.handleClick = this._handleClick.bind(this);
  }
  _handleClick(event) {
    event.preventDefault();
    const route = this.context.router.push(this.props.href);
    if (window.history) {
      document.title = route.title;
      window.history.pushState(null, null, this.props.href);
    }
  }
  render() {
    return <a href={this.props.href} onClick={this.handleClick}>{this.props.children}</a>;
  }
}
Link.contextTypes = {
  router: PropTypes.object,
};

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
    this.props.router.addChangeListener(route => {
      this.setState({route});
    });

    if (window.history) {
      window.addEventListener('popstate', event => {
        const route = this.props.router.push(location.pathname);
        document.title = route.title;
      });
    }
  }

  render() {
    const route = this.state.route;
    const element = React.createElement(route.component, route.props);

    return (
      <section style={style.navigator}>
        {React.createElement(route.component, Object.assign({}, this.props, {route}))}
      </section>
    );
  }
}
Navigator.childContextTypes = {
  router: PropTypes.object,
};
