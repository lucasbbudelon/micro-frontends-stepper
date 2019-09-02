const express = require('express');
const axios = require('axios');
const https = require('https');

const router = express.Router();
const urlApi = 'https://localhost:44390/api/process';

router.get('/', function (req, res, next) {
  const reqApi = axios({
    url: urlApi,
    method: 'GET',
    ...getRequestConfigs()
  });
  resolveRequest(reqApi, res);
});

router.get('/:id', function (req, res, next) {
  const reqApi = axios({
    url: `${urlApi}/${req.params.id}`,
    method: 'GET',
    ...getRequestConfigs()
  });
  resolveRequest(reqApi, res);
});

router.get('/:id/steps/:codeName', function (req, res, next) {
  const reqApi = axios({
    url: `${urlApi}/${req.params.id}/steps/${req.params.codeName}`,
    method: 'GET',
    ...getRequestConfigs()
  });
  resolveRequest(reqApi, res);
});

router.post('/', function (req, res, next) {
  const reqApi = axios({
    url: urlApi,
    method: 'POST',
    data: req.body,
    ...getRequestConfigs()
  });
  resolveRequest(reqApi, res);
});

router.patch('/:id/step/:codeName', function (req, res, next) {
  const reqApi = axios({
    url: `${urlApi}/${req.params.id}/step/${req.params.codeName}`,
    method: 'PATCH',
    data: req.body,
    ...getRequestConfigs()
  });
  resolveRequest(reqApi, res);
});

function getRequestConfigs() {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'json',
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  };
};

function resolveRequest(req, res) {
  req
    .then(success => res
      .status(success.status)
      .send(success.data))
    .catch(error => {
      const apiResponse = error.response;
      const statusCode = apiResponse 
        ? apiResponse.status 
        : 503;
      const body = apiResponse 
        ? apiResponse.statusText 
        : `Service "${error.config.url}" Unavailable`;
      res
        .status(statusCode)
        .send(body)
    });
}

module.exports = router;