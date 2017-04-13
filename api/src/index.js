const express = require('express');

const app = express();

const loginStatuses = {
  NOT_AUTHORIZED: '__NOT_AUTHORIZED',
  CONNECTED: '__CONNECTED',
};

// handlers
function loginStatusHandler(req, res) {
  res.json({
    status: loginStatuses.NOT_AUTHORIZED,
  });
}

function createUserHandler(req, res) {
  User.findOrCreate().then(user => {
    Token.find({
      where: {provider, uid}
    })
  });
  res.json({
    accessToken: 'ACCESS_TOKEN',
  });
}

// router
const router = new express.Router('');

router.use('/api', new express.Router()
  .use('/v1', new express.Router()
    .get('/login-status', loginStatusHandler)
    .post('/users', createUserHandler)
  )
);

app.use(router);

// main
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
