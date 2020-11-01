import { APIGatewayProxyHandler } from 'aws-lambda';
import products from '../../mocks/products.json';
import { getCORSHeaders } from '../../utils';
import { errorMessages } from './errorMessages';
import 'source-map-support/register';

export const getProductById: APIGatewayProxyHandler = async (event, _context) => {
  const { productId } = event.pathParameters;
  const product = products.find(({ id }) => event.pathParameters.productId === id);

  if (!product) {
    return {
      statusCode: 404,
      headers: getCORSHeaders(),
      body: errorMessages.notFound(productId),
    }
  }

  return {
    statusCode: 200,
    headers: getCORSHeaders(),
    body: JSON.stringify(product, null, 2),
  };
};
