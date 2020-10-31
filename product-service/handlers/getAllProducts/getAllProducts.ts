import { APIGatewayProxyHandler } from 'aws-lambda';
import * as products from '../../mocks/products.json';
import 'source-map-support/register';

export const getAllProducts: APIGatewayProxyHandler = async (_, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(products, null, 2),
  };
};
