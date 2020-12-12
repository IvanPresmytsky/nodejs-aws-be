import express from 'express';
import dotenv from 'dotenv';
import { Method } from 'axios';

import { runProxy, getServiceUrl } from './utils';

dotenv.config({
  path: '.env',
});

const PORT = process.env.PORT || 3000
const app = express();

app.use(express.json());

app.all('/*', async (req, res) => {
  const { originalUrl, method, body } = req;

  const serviceUrl = getServiceUrl(originalUrl);
  console.log('SERVICE_URL', serviceUrl);
  if (!serviceUrl) {
    res.status(502).json({ error: 'Cannot process request' });
  }

  const finalURL = `${serviceUrl}${originalUrl}`;

  console.log('finalURL: ', finalURL);

  try {
    const { status, data } = await runProxy(finalURL, method as Method, body);
    res.status(status).json(data);
  } catch (error) {
    const errorMessage = `Something went wrong! ${JSON.stringify(error)}`
    console.error(errorMessage);

    const { response } = error;

    if (!error.response) {
      res.status(500).json(errorMessage);
    }

    res.status(response.status).json(response.data);
  }
});


(() => {
  app.listen(PORT, () => console.log(`The app is listening on port ${PORT}`));
})();
