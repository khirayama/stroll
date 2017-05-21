import React, {Component} from 'react';
import PropTypes from 'prop-types';

const style = {
  page: {
    width: '100%',
    height: '100%',
  },
};

export default class Page extends Component {
  render() {
    return (
      <div style={style.page}>{this.props.children}</div>
    );
  }
}
Page.propTypes = {
  children: PropTypes.node.isRequired,
};
