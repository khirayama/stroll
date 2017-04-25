import HomePage from './components/home-page';

import React from 'react';
import {Link} from './components/navigator';

class TestPage extends React.Component {
  render() {
    return (
      <section>
        <div>Test</div>
        <Link href="/">to home</Link>
      </section>
    );
  }
}

export const routes = [{
  path: '/',
  key: 'HOME_PAGE',
  data: () => {
    return new Promise(resolve => {
      resolve();
    });
  },
  title: 'HOME | Stroll',
  component: HomePage,
}, {
  path: '/test',
  key: 'TEST_PAGE',
  data: () => {
    return new Promise(resolve => {
      resolve();
    });
  },
  title: 'TEST | Stroll',
  component: TestPage,
}];
