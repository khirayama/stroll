const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Stroll</title>
    <!-- standalone for android-->
    <meta name="mobile-web-app-capable" content="yes">
    <link rel="icon" sizes="192x192" href="/images/icon-android.png">
    <link rel="manifest" href="/manifest.json">
    <!-- standalone for ios-->
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="Handle">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <link rel="apple-touch-icon" sizes="76x76" href="/images/icon-ios.png">
    <!-- <link rel="stylesheet" href="/index.css"> -->
    <!-- <script src="/bundle.js" defer></script> -->
  </head>
  <body>
    <section class="application"></section>
    <div onclick="eventHandlers.handleClickLoginWithFacebook(event)">Login with Facebook</div>
    <div onclick="eventHandlers.handleClickLogout(event)">Logout</div>
  </body>
  <script>
    window.fbAsyncInit = function() {
      FB.init({
        appId: '772950426216569',
        xfbml: true,
        version: 'v2.8',
        status: true,
      });
      FB.AppEvents.logPageView();
      FB.getLoginStatus(res => {
        console.log(res);
      });
    };

    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    const eventHandlers = {
      handleClickLoginWithFacebook: (event) => {
        FB.login(res => {
          console.log(res);
        });
      },
      handleClickLogout: (event) => {
        FB.logout(res => {
          console.log(res);
        });
      },
    };
  </script>
</html>
  `);
});

app.listen(3001, () => {
  console.log('Example app listening on port 3001!');
});
