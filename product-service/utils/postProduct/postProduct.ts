import axios from 'axios';
import { validateProduct } from '..';

export const postProduct = (data: string) => {
  if (!validateProduct(data)) {
    throw new Error('Data for creating product is invalid!');
  }

  return axios({
    method: 'POST',
    url: 'https://hrxry5b1t8.execute-api.eu-west-1.amazonaws.com/dev/products',
    data,
  });
}