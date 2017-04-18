import React from 'react';
import ReactDOM from 'react-dom';

import HomePage from './components/home-page';

window.addEventListener('DOMContentLoaded', () => {
  console.log(`Start app at ${new Date()}.`);

  ReactDOM.render(<HomePage />, document.querySelector('.application'));
});
