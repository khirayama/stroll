import React from 'react';

import axios from 'axios';
import cookies from 'browser-cookies';

import {Link} from '../../libs/web-storyboard/components';

import Container from '../container';

export default class MainStoryboard extends Container {
  constructor(props) {
    super(props);

    this.handleClickLoginWithFacebook = this._handleClickLoginWithFacebook.bind(this);
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
      const accessToken = cookies.get('stroll_access_token');
      axios.get('http://localhost:3000/api/v1/login-status', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(res => {
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
      const provider = 'facebook';
      const uid = res.authResponse.userID;
      axios.post('http://localhost:3000/api/v1/tokens', {
        provider,
        uid,
      }).then(res_ => {
        const accessToken = res_.data.accessToken;
        cookies.set('stroll_access_token', accessToken);
      });
    });
  }
  render() {
    return (
      <section>
        <ul>
          <li><Link href="/profile">Profile</Link></li>
          <li><Link href="/posts">Posts</Link></li>
        </ul>
        <div onClick={this.handleClickLoginWithFacebook}>Login with Facebook</div>
      </section>
    );
  }
}
MainStoryboard.propTypes = {
};
