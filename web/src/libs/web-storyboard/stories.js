// [Main Storyboard]-----(show)---[Post Index Storyboard]---(show)---[Post Show Storyboard]
//                    |
//                    ---(temporary)---[Profile Storyboard]

import React, {Component} from 'react';
import {Link, BackLink} from './components';

class MainStoryboard extends Component {
  render() {
    return (
      <section>
        <h1>MainStoryboard</h1>
        <ul>
          <li><Link href="/profile">Profile</Link></li>
          <li><Link href="/posts">Posts</Link></li>
        </ul>
      </section>
    );
  }
}
class PostIndexStoryboard extends Component {
  render() {
    return (
      <section>
        <h1>PostIndexStoryboard</h1>
        <BackLink>Back</BackLink>
        <ul>
          <li><Link href="/posts/1">Post 1</Link></li>
          <li><Link href="/posts/2">Post 2</Link></li>
        </ul>
      </section>
    );
  }
}
class PostShowStoryboard extends Component {
  render() {
    return (
      <section>
        <h1>PostShowStoryboard</h1>
        <BackLink>Back</BackLink>
        <ul>
          <li><Link href="/posts/1">Post 1</Link></li>
          <li><Link href="/posts/2">Post 2</Link></li>
        </ul>
      </section>
    );
  }
}
class ProfileStoryboard extends Component {
  render() {
    return (
      <section>
        <h1>ProfileStoryboard</h1>
        <BackLink>Back</BackLink>
      </section>
    );
  }
}

const StoryboardKeys = {
  MainStoryboard: 'Main Storyboard',
  PostIndexStoryboard: 'Post Index Storyboard',
  PostShowStoryboard: 'Post Show Storyboard',
  ProfileStoryboard: 'Profile Storyboard',
};

const segueTypes = {
  show: 'show',
  temporary: 'temporary',
};

const segues = [{
  from: StoryboardKeys.MainStoryboard,
  to: StoryboardKeys.PostIndexStoryboard,
  type: segueTypes.show,
}, {
  from: StoryboardKeys.MainStoryboard,
  to: StoryboardKeys.ProfileStoryboard,
  type: segueTypes.temporary,
}, {
  from: StoryboardKeys.PostIndexStoryboard,
  to: StoryboardKeys.PostShowStoryboard,
  type: segueTypes.show,
}];

const storyboards = [{
  root: true,
  key: StoryboardKeys.MainStoryboard,
  component: MainStoryboard,
  path: '/',
  options: {
    args: null,
    initialize: null,
    title: 'Main',
  },
}, {
  key: StoryboardKeys.PostIndexStoryboard,
  component: PostIndexStoryboard,
  path: '/posts',
  options: {
    args: null,
    initialize: (params, args) => {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('fetch posts');
          resolve();
        }, 500);
        // Post.fetch(args).then(posts => {
        //   resolve(posts);
        // });
      });
    },
    title: 'Posts',
  },
}, {
  key: StoryboardKeys.PostShowStoryboard,
  component: PostShowStoryboard,
  path: '/posts/:id',
  options: {
    args: null,
    initialize: (params, args) => {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('fetch post');
          resolve({
            id: params.id,
            title: `${params.id} post!`,
          });
        }, 200);
        // Post.find(params.id).then(post => {
        //   resolve(post);
        // });
      });
    },
    title: post => {
      return post.title;
    },
  },
}, {
  key: StoryboardKeys.ProfileStoryboard,
  component: ProfileStoryboard,
  path: '/profile',
  options: {
    args: null,
    initialize: null,
    title: 'Profile',
  },
}];

export {
  segues,
  storyboards,
};
