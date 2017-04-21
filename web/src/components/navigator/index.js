import React, {Component} from 'react';

const style = {
  navigator: {
    width: '100%',
    height: '100%',
  },
};

export default class Navigator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      path: '/',
      route: props.routes[0],
      props: null,
    };
  }
  render() {
    const route = this.state.route;

    let props = null;
    if (route.props === 'function') {
      const result = route.props();
      if (!!(result || {}).then) {
        result.then(res => {
        });
      } else {
        props = result;
      }
    } else {
      props = route.props;
    }

    const element = React.createElement(route.component, route.props);

    return (
      <section style={style.navigator}>{element}</section>
    );
  }
}
