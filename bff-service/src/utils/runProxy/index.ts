import axios, { Method } from 'axios';

export const runProxy = (url: string, method: Method, body = {}) => {
  const hasBody = Object.keys(body).length > 0;
  const data = hasBody ? { data: body } : {}

  return axios({
    method,
    url,
    ...data,
  });
};
