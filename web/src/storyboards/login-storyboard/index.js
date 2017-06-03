import React from 'react';
import PropTypes from 'prop-types';

import {Link} from '../../libs/web-storyboard/components';

import Container from '../container';
import {LoginStatus, Token} from '../../repositories';
import {setAccessToken} from '../../utils';

export default class LoginStoryboard extends Container {
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
      Token.create({
        provider,
        uid,
      }).then(({accessToken}) => {
        setAccessToken(accessToken);
        LoginStatus.get(accessToken).then(({status}) => {
          if (status === 'connected') {
            this.props.store.dispatch({
              type: '__INITIALIZE_MAIN_STORYBOARD',
              isAuthenticated: true,
            });
            this.context.move('/');
          }
        });
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
LoginStoryboard.propTypes = {
};
LoginStoryboard.contextTypes = {
  move: PropTypes.func,
};
