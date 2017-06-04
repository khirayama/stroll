import {Component} from 'react';
import PropTypes from 'prop-types';

import {extractAccessToken} from '../utils';

function isBrowser() {
  return typeof window === 'object';
}

export default class Container extends Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({
      initializing: false,
    }, props.store.getState());

    this.updateState = this._updateState.bind(this);
  }
  componentWillMount() {
    if (isBrowser()) {
      this.setState({initializing: true});
      this.props.initialize(window.location.pathname, {
        accessToken: extractAccessToken(),
        dispatch: this.props.store.dispatch.bind(this.props.store),
      }).then(result => {
        if (result.title) {
          window.document.title = result.title;
        }
        this.setState({initializing: false});
      });
    }
  }
  componentDidMount() {
    const store = this.props.store;

    store.addChangeListener(this.updateState);
  }
  componentWillUnmount() {
    const store = this.props.store;

    store.removeChangeListener(this.updateState);
  }
  _updateState() {
    const store = this.props.store;

    this.setState(store.getState());
  }
}
Container.propTypes = {
  initialize: PropTypes.func.isRequired,
  store: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
    addChangeListener: PropTypes.func.isRequired,
  }).isRequired,
};

