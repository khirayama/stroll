import React from 'react';

import {Link} from '../../libs/web-storyboard/components';

import Container from '../container';

export default class MainStoryboard extends Container {
  render() {
    return (
      <section>
        <h1>Main</h1>
        <ul>
          <li><Link href="/profile">Profile</Link></li>
        </ul>
      </section>
    );
  }
}
MainStoryboard.propTypes = {
};
