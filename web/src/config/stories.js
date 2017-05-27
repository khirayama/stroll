
// [Main Storyboard]-----(show)---[Post Index Storyboard]---(show)---[Post Show Storyboard]
//                    |
//                    ---(temporary)---[Profile Storyboard]

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link, BackLink} from '../libs/web-storyboard/components';

import Page from '../components/page';

function isBrowser() {
  return typeof window === 'object';
}

class Container extends Component {
  constructor(props) {
    super(props);

    this.state = props.store.getState();
    this.state.initializing = false;
  }
  componentWillMount() {
    if (isBrowser()) {
      this.setState({initializing: true});
      this.props.initialize(window.location.pathname).then(result => {
        if (result.title) {
          window.document.title = result.title;
        }

        const action = result.value;
        this.props.store.dispatch(action);
        this.setState({initializing: false});
      });
    }
  }
}
Container.propTypes = {
};

class MainStoryboard extends Container {
  constructor(props) {
    super(props);

    this.handleClickLoginWithFacebook = this._handleClickLoginWithFacebook.bind(this);
    this.handleClickLogout = this._handleClickLogout.bind(this);
  }
  componentDidMount() {
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: '772950426216569',
        xfbml: true,
        version: 'v2.8',
        status: true,
      });
      window.FB.AppEvents.logPageView();
      window.FB.getLoginStatus(res => {
        console.log(res);
      });
    };

    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      const js = d.createElement(s);
      js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }
  _handleClickLoginWithFacebook() {
    window.FB.login(res => {
      console.log(res);
    });
  }
  _handleClickLogout() {
    window.FB.logout(res => {
      console.log(res);
    });
  }
  render() {
    return (
      <Page>
        <ul>
          <li><Link href="/profile">Profile</Link></li>
          <li><Link href="/posts">Posts</Link></li>
        </ul>
        <div onClick={this.handleClickLoginWithFacebook}>Login with Facebook</div>
        <div onClick={this.handleClickLogout}>Logout</div>
      </Page>
    );
  }
}
class PostIndexStoryboard extends Container {
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
class PostShowStoryboard extends Container {
  render() {
    return (
      <section>
        <h1>PostShowStoryboard</h1>
        <h2>{({}).title}</h2>
        <BackLink>Back</BackLink>
        <ul>
          <li><Link href="/posts/1">Post 1</Link></li>
          <li><Link href="/posts/2">Post 2</Link></li>
        </ul>
      </section>
    );
  }
}
PostShowStoryboard.propTypes = {
};
class ProfileStoryboard extends Container {
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
}, {
  from: StoryboardKeys.PostShowStoryboard,
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
          console.log('fetch posts', args);
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
          console.log('fetch posts', args);
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
