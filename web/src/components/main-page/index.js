import React, {Component} from 'react';

import Page from '../page';
import {Link} from '../navigator';

export default class MainPage extends Component {
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
        <Link href="/test">to test</Link>
        <div onClick={this.handleClickLoginWithFacebook}>Login with Facebook</div>
        <div onClick={this.handleClickLogout}>Logout</div>
      </Page>
    );
  }
}
