import products from '../../mocks/products.json';
import { TProduct, TProductId } from '../../types';

export const getInsertStocksQuery = (productIds: TProductId[], productsToInsert = products) => {
  const query = productsToInsert.reduce((acc: string, { count }: TProduct, index: number) => {
    return `${acc} ('${productIds[index].id}', ${count}),`;
  }, 'INSERT INTO stocks (product_id, count) VALUES');

  return query.slice(0, query.length - 1);
};
