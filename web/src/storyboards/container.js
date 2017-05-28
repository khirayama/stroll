import {Component} from 'react';
import PropTypes from 'prop-types';

function isBrowser() {
  return typeof window === 'object';
}

export default class Container extends Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({
      initializing: false,
    }, props.store.getState());
  }
  componentWillMount() {
    if (isBrowser()) {
      this.setState({initializing: true});
      this.props.initialize(window.location.pathname).then(result => {
        if (result.title) {
          window.document.title = result.title;
        }

        const action = result.value;
        this.props.store.dispatch(action);
        this.setState({initializing: false});
      });
    }
  }
}
Container.propTypes = {
  initialize: PropTypes.func.isRequired,
  store: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
  }).isRequired,
};

