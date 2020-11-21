import axios from 'axios';

export const postProduct = (data: string) => axios({
  method: 'POST',
  url: 'https://hrxry5b1t8.execute-api.eu-west-1.amazonaws.com/dev/products',
  data,
});
