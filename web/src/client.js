import React from 'react';
import ReactDOM from 'react-dom';

import {createStore} from '@khirayama/circuit';

import {routes} from './routes';

import Navigator from './components/navigator';

window.addEventListener('DOMContentLoaded', () => {
  console.log(`Start app at ${new Date()}.`);

  const store = createStore(window.state);

  ReactDOM.render((
    <Navigator
      path={location.pathname}
      routes={routes}
    />
  ), document.querySelector('.application'));
});
