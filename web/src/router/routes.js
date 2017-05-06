import HomePage from '../components/home-page';

import React from 'react';
import Page from '../components/page';
import {BackLink, Link} from '../components/navigator';

class TestPage extends React.Component {
  render() {
    return (
      <Page>
        <p>
          <BackLink>back</BackLink>
        </p>
        <p>
          <Link href="/">to home</Link>
        </p>
        <div>Test</div>
      </Page>
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
