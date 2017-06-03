import React from 'react';

import {BackLink} from '../../libs/web-storyboard/components';

import Container from '../container';

export default class ProfileStoryboard extends Container {
  render() {
    return (
      <section>
        <h1>ProfileStoryboard</h1>
        <BackLink>Back</BackLink>
      </section>
    );
  }
}
ProfileStoryboard.propTypes = {
};
