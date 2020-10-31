import { APIGatewayProxyHandler } from 'aws-lambda';
import * as products from '../../mocks/products.json';
import 'source-map-support/register';
import { errorMessages } from './errorMessages';

export const getProductById: APIGatewayProxyHandler = async (event, _context) => {
  const { productId } = event.pathParameters;
  const product = products.find(({ id }) => event.pathParameters.productId === id);

  if (!product) {
    return {
      statusCode: 404,
      body: errorMessages.notFound(productId),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(product, null, 2),
  };
};
