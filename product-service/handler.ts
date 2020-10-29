import { APIGatewayProxyHandler } from 'aws-lambda';
import * as products from './mocks/products.json';
import 'source-map-support/register';

export const getAllProducts: APIGatewayProxyHandler = async (event, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(products, null, 2),
  };
};

export const getProductById: APIGatewayProxyHandler = async (event, _context) => {
  const product = products.find(({ id }) => event.pathParameters.productId === id);
  return {
    statusCode: 200,
    body: JSON.stringify(product, null, 2),
  };
};
