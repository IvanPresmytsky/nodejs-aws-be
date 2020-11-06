import products from '../../mocks/products.json';
import { TProduct } from '../../types';

export const getInsertProductsQuery = (productsToInsert = products) => {
  const query = productsToInsert.reduce((acc: string, { title, description, price }: TProduct) => {
    return `${acc} ('${title}', '${description}', ${price}),`;
  }, 'INSERT INTO products (title, description, price) VALUES');
  return query.slice(0, query.length - 1);
};
