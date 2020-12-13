import express from 'express';
import dotenv from 'dotenv';
import { Method } from 'axios';
import { StatusCodes } from 'http-status-codes';

import { getServiceUrl, getServiceName } from './utils';
import { CacheService, ECacheFields } from './services/cacheService';

dotenv.config({
  path: '.env',
});

const PORT = process.env.PORT || 3000;
const CACHE_TIMER = 120000;
const app = express();
const cacheService = new CacheService(CACHE_TIMER);

app.use(express.json());

app.use((_req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Credentials': 'true'
  });
  next();
});

app.all('/*', async (req, res) => {
  const { originalUrl, method, body } = req;

  const serviceName = getServiceName(originalUrl) as ECacheFields;
  const serviceUrl = getServiceUrl(originalUrl);

  if (!serviceUrl) {
    res.status(StatusCodes.BAD_GATEWAY).json({ error: 'Cannot process request' });
  }

  const finalURL = `${serviceUrl}${originalUrl}`;

  try {
    const { status, data } = await cacheService.runCachedProxy(serviceName, finalURL, method as Method, body);

    res.status(status).json(data);
  } catch (error) {
    const errorMessage = `Something went wrong! ${JSON.stringify(error)}`
    console.error(errorMessage);

    const { response } = error;

    if (!response) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorMessage);
    }

    res.status(response?.status).json(response?.data);
  }
});


(() => {
  app.listen(PORT, () => console.log(`The app is listening on port ${PORT}`));
})();
