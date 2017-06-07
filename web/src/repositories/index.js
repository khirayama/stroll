import axios from 'axios';

const req = axios.create({
  baseURL: 'http://localhost:3000/api/v1/',
});

// Login status
export const LoginStatus = {
  get: accessToken => {
    return new Promise(resolve => {
      req.get('/login-status', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(({data}) => {
        resolve(data);
      }).catch(err => console.log(err));
    });
  },
};

// Token
export const Token = {
  create: params => {
    return new Promise(resolve => {
      req.post('/tokens', params).then(({data}) => {
        resolve(data);
      }).catch(err => console.log(err));
    });
  },
};


export const Place = {
  nearBy: (params) => {
    const params_ = {
      location: `${params.location.lat},${params.location.lng}`,
      radius: params.radius || 400,
      keyword: params.keyword || '',
    };
    return new Promise(resolve => {
      req.get('/places/nearbysearch', {params: params_}).then(({data}) => {
        resolve(data);
      }).catch(err => console.log(err));
    });
  },
  textSearch: (params) => {
    const params_ = {
      location: `${params.location.lat},${params.location.lng}`,
      radius: params.radius || 400,
      query: params.query || '',
    };
    return new Promise(resolve => {
      req.get('/places/textsearch', {params: params_}).then(({data}) => {
        resolve(data);
      }).catch(err => console.log(err));
    });
  }
};
