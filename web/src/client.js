import React from 'react';
import ReactDOM from 'react-dom';

import {createStore} from '@khirayama/circuit';

import {routes} from './routes';
import Router from './router';
import Navigator from './components/navigator';

window.addEventListener('DOMContentLoaded', () => {
  console.log(`Start app at ${new Date()}.`);

  const store = createStore(window.state);

  const router = new Router(routes);
  router.push(location.pathname);

  ReactDOM.render((
    <Navigator
      router={router}
      store={store}
    />
  ), document.querySelector('.application'));
});
