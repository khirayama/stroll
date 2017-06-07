import path from 'path';

import express from 'express';
import cookieParser from 'cookie-parser';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import {Store} from '@khirayama/circuit';

import Router from './libs/web-storyboard/router';
import {segues, storyboards} from './config/stories';
import {Navigator} from './libs/web-storyboard/components';

import {reducer} from './reducers';
import {STROLL_ACCESS_TOKEN_KEY} from './constants';

const app = express();

function template(title, content, state) {
  return (`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>${title}</title>
    <!-- standalone for android-->
    <meta name="mobile-web-app-capable" content="yes">
    <link rel="icon" sizes="192x192" href="/images/icon-android.png">
    <link rel="manifest" href="/manifest.json">
    <!-- standalone for ios-->
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="Handle">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <link rel="apple-touch-icon" sizes="76x76" href="/images/icon-ios.png">
    <link rel="stylesheet" href="/index.css">
    <script src="/bundle.js" defer></script>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDbK99gNSjp2lu2-gQJg6bQwUpoxE-OIQA"></script>
  </head>
  <body>
    <section class="application">${content}</section>
    <script>window.state = ${JSON.stringify(state)};</script>
  </body>
</html>
  `);
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get([
  '/login',
  '/',
  '/profile',
], (req, res) => {
  const initialState = {
    isAuthenticated: false,
  };
  const router = new Router(segues, storyboards);
  const store = new Store(initialState, reducer);

  router.initialize(req.path, {
    accessToken: req.cookies[STROLL_ACCESS_TOKEN_KEY],
    dispatch: store.dispatch.bind(store),
  }).then(result => {
    const state = store.getState();
    if (!state.isAuthenticated && req.path !== '/login') {
      res.redirect('/login');
    } else {
      res.send(
        template(
          result.title,
          ReactDOMServer.renderToString((
            <Navigator
              path={req.path}
              router={router}
              store={store}
              />
          )),
          store.getState()
        )
      );
    }
  }).catch(err => console.log(err));
});

app.listen(3001, () => {
  console.log('Example app listening on port 3001!');
});
