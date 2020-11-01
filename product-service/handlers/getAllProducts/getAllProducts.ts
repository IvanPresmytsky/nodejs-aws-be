import { APIGatewayProxyHandler } from 'aws-lambda';
import products from '../../mocks/products.json';
import { getCORSHeaders } from '../../utils';
import 'source-map-support/register';

export const getAllProducts: APIGatewayProxyHandler = async (_, _context) => {
  return {
    statusCode: 200,
    headers: getCORSHeaders(),
    body: JSON.stringify(products, null, 2),
  };
};
