import { TProduct } from '../../types';

export const validateProduct = (data: string | TProduct) => {
  const parsedData = typeof data === 'string'
    ? JSON.parse(data)
    : data;

  const {
    title,
    description,
    price,
    count
  } = parsedData;

  return !!(title && description && price && count);
}
