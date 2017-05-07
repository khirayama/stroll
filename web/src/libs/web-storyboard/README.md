# Web Storyboard

## Stack

### browser
data
  initialize
    title
render(transition)

### node
data
  initialize
    title
      render


##  Example

const segues = [{
  from: 'Main Storyboard',
  to: 'Post Index Storyboard'
  type: 'show',
}, {
  from: 'Main Storyboard',
  to: 'Profile Storyboard',
  type: 'temporary',
}, {
  from: 'Post Index Storyboard',
  to: 'Post Show Storyboard',
  type: 'show',
}];

const storyboards = [{
  root: true,
  key: 'Main Storyboard',
  component: MainStoryboard,
  path: '/',
  data: null,
  initialize: null,
  title: 'Main',
}, {
  key: 'Post Index Storyboard',
  component: PostIndexStoryboard,
  path: '/posts',
  data: null,
  initialize: (params, data) => {
    return new Promise(resolve => {
      Post.fetch(data).then(posts => {
        resolve(posts);
      });
    });
  },
  title: 'Posts',
}, {
  key: 'Post Show Storyboard',
  component: PostShowStoryboard,
  path: '/posts/:id',
  data: null,
  initialize: (params, data) => {
    return new Promise(resolve => {
      Post.find(params.id).then(post => {
        resolve(post);
      });
    });
  },
  title: post => {
    return post.title;
  },
}];

[Main Storyboard]-----(show)---[Post Index Storyboard]---(show)---[Post Show Storyboard]
                   |
                   ---(temporary)---[Profile Storyboard]
