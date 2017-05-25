import path from 'path';

import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import {Store} from '@khirayama/circuit';

import Router from './libs/web-storyboard/router';
import {segues, storyboards} from './config/stories';
import {Navigator} from './libs/web-storyboard/components';

import {reducer} from './reducer';

const app = express();

function resetStyle() {
  return (`
/* reset */
html,
body,
section,
header,
footer,
div,
h1,
h2,
h3,
h4,
h5,
h6,
p,
a,
span,
ul,
li,
label,
input,
textarea,
select,
button,
table,
thead,
tbody,
tr,
th,
td,
i {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  outline: 0;
  border: 0;
  border-radius: 0;
  font-weight: inherit;
  font-style: normal;
  font-size: inherit;
  line-height: 1.4;
  vertical-align: baseline;
  font-feature-settings: "palt";
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-touch-callout: none;
  -webkit-user-select: none;
}
ul {
  list-style: none;
}
h1 {
  font-size: 2rem;
}
h2 {
  font-size: 1.8rem;
}
h3 {
  font-size: 1.6rem;
}
h4 {
  font-size: 1.4rem;
}
h5 {
  font-size: 1.2rem;
}
h6 {
  font-size: 1rem;
}
small {
  font-size: 0.8rem;
}
input,
textarea,
select,
button {
  font-size: inherit;
  font-family: inherit;
}
form,
input,
textarea,
select,
button,
a {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-user-select: auto;
}
a {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

/* application */
html,
body,
.application {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
html {
  color: #666;
  font-family: sans-serif;
}
  `);
}

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
    <script src="/bundle.js" defer></script>
  </head>
  <style>${resetStyle()}</style>
  <body>
    <section class="application">${content}</section>
    <script>window.state = ${JSON.stringify(state)};</script>
  </body>
</html>
  `);
}

app.use(express.static(path.join(__dirname, 'public')));

app.get([
  '/',
  '/posts',
  '/posts/:id',
  '/profile',
], (req, res) => {
  const router = new Router(segues, storyboards);
  const store = new Store({}, reducer);

  router.initialize(req.path).then(result => {
    res.send(
      template(
        result.title,
        ReactDOMServer.renderToString((
          <Navigator
            path={req.path}
            router={router}
            />
        )),
        store.getState()
      )
    );
  }).catch(err => console.log(err));
});

app.listen(3001, () => {
  console.log('Example app listening on port 3001!');
});
