# Stroll

## Overview

- Launch
  - if user has access token
    `GET: /api/v1/login-status` with access token as 'Autholization: Bearer'.
    - if res.status === 'connected'
      move to main scene
    - else
      move to login scene
  - else
    move to login scene
- Login
  - Login with facebook / google
    get facebook or google's userID and `POST: /api/v1/users` with provider name and userID.
    After find or create user, return access token as response.
- Main
  - Func:SearchPrace
  - Tab:Buckets
    - Func:Filter(self|following)
    - View:BucketList
      - Bucket / Gone
    - View:BucketMap
  - Tab:Stamps
    - View:StampList
  - Link:Profile
- User(as Profile / User)
  - Func:Search
  - View:Profile
  - Link:Following
  - Link:Followers
  - Tab:Buckets
    - Func:Filter(self|following)
    - View:BucketList
    - View:BucketMap
  - Tab:Stamps
    - View:StampList
- Users(as Following / Followers)
  - Func:Search
  - Link:User
  - View:UserList
- Prace
  - View:Information
  - View:Map
  - View:StampList
  - Action:Throw
  - Action:Stamp

## Database

- users(id / provider / uid / created_at / updated_at)
- user_relationships(id / follower_user_id / followed_user_id / created_at / updated_at)
- buckets(id / user_id / place_id / name / lat / lng / created_at / updated_at)
- stamps(id / user_id / place_id / created_at / updated_at)
