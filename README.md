# Stroll

## Overview
- start app
  - if user has access token
    `GET: /api/v1/login-status` with access token as 'Autholization: Bearer'.
    - if res.status === 'connected'
      move to main scene
    - else
      move to login scene
  - else
    mode to login scene
- login scene
  - login with facebook / google
    get facebook or google's userID and `POST: /api/v1/users` with provider name and userID.
    After find or create user, return access token as response.
- main scene
  show user information


## Database

users(id / provider / uid / created_at / updated_at)
