import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';

import { DBClient } from '../../models';
import { messagesBuilder, responseBuilder } from '../../utils';

import 'source-map-support/register';

export const getProductById: APIGatewayProxyHandler = async (event, _context) => {
  console.log(messagesBuilder.incomingEvent<APIGatewayProxyEvent>(event));
  const productId = event?.pathParameters?.productId;
  
  if (!productId) {
    console.error(messagesBuilder.getProductById.badRequest());
    return responseBuilder.badRequest(messagesBuilder.getProductById.badRequest());
  }

  const client = new DBClient();

  try {
    await client.connect();

    const product = await client.getProductById(productId);
  
    if (!product) {
      console.error(messagesBuilder.getProductById.notFound(productId));
      return responseBuilder.notFound(messagesBuilder.getProductById.notFound(productId));
    }

    console.error(messagesBuilder.getProductById.success(product));
    return responseBuilder.success(product);
  } catch (err) {
    console.error(messagesBuilder.generalError(err));
    return responseBuilder.serverError(messagesBuilder.generalError(err));
  } finally {
    await client.disconnect();
  }
};
