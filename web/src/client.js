import React from 'react';
import ReactDOM from 'react-dom';

import {createStore} from '@khirayama/circuit';

import Router from './libs/web-storyboard/router';
import {segues, storyboards} from './libs/web-storyboard/stories';
import {Navigator} from './libs/web-storyboard/components';

import {reducer} from './reducer';

window.addEventListener('DOMContentLoaded', () => {
  console.log(`Start app at ${new Date()}.`);

  const store = createStore(window.state, reducer);

  const router = new Router(segues, storyboards);

  ReactDOM.render((
    <Navigator
      path={window.location.pathname}
      router={router}
      store={store}
      />
  ), document.querySelector('.application'));
});
