import test from 'ava';
import React from 'react';

import Router from '../src/router';

class Home extends React.Component {
  render() {
    return <div>Home</div>;
  }
}

class Posts extends React.Component {
  render() {
    return <div>Posts</div>;
  }
}

class Post extends React.Component {
  render() {
    return <div>Post</div>;
  }
}

const routes = [{
  path: '/',
  key: 'home',
  data: null,
  title: 'home',
  component: Home,
}, {
  path: '/posts',
  key: 'posts',
  data: null,
  title: 'Posts',
  component: Posts,
}, {
  path: '/posts/:id',
  key: 'post',
  data: null,
  title: 'Post',
  component: Post,
}];

test.beforeEach(t => {
  t.context.router = new Router(routes);
});

test('router._getRoute', t => {
  const router = t.context.router;
  const route = router._getRoute('/');

  t.deepEqual(
    route,
    Object.assign({}, routes[0], {
      params: {}
    })
  );
});

test('router._getRoute', t => {
  const router = t.context.router;
  const route = router._getRoute('/posts');

  t.deepEqual(
    route,
    Object.assign({}, routes[1], {
      params: {}
    })
  );
});

test('router._getRoute', t => {
  const router = t.context.router;
  const route = router._getRoute('/posts/10');

  t.deepEqual(
    route,
    Object.assign({}, route, {
      params: {id: '10'}
    })
  );
});

test('router._getRoute', t => {
  const router = t.context.router;
  const route = router._getRoute('/foo');

  t.deepEqual(
    route,
    null
  );
});

test('router.push', t => {
  const router = t.context.router;
  router.push('/');

  t.is(
    router._histories.length,
    1
  );
  t.deepEqual(
    router.present(),
    routes[0]
  );

  router.push('/');

  t.is(
    router._histories.length,
    1
  );
  t.deepEqual(
    router.present(),
    routes[0]
  );

  router.push('/posts');

  t.is(
    router._histories.length,
    2
  );
  t.deepEqual(
    router.present(),
    routes[1]
  );
});

test('router.pop', t => {
  const router = t.context.router;
  router.push('/');
  router.push('/posts');

  t.is(
    router._histories.length,
    2
  );
  t.deepEqual(
    router.present(),
    routes[1]
  );

  router.pop();
  t.is(
    router._histories.length,
    1
  );
  t.deepEqual(
    router.present(),
    routes[0]
  );
});
