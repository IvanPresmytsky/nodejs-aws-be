import { APIGatewayProxyHandler } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';

import { DBClient } from '../../models';
import { getCORSHeaders, messagesBuilder } from '../../utils';

import 'source-map-support/register';

export const getProductById: APIGatewayProxyHandler = async (event, _context) => {
  console.log(messagesBuilder.incomingEvent(event));
  const productId = event?.pathParameters?.productId;
  const headers = getCORSHeaders();
  
  if (!productId) {
    console.error(messagesBuilder.getProductById.badRequest());
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      headers,
      body: messagesBuilder.getProductById.badRequest(),
    };
  }

  const client = new DBClient();

  try {
    await client.connect();
    // TODO remove initialization after task-4
    await client.initDBData();
    const product = await client.getProductById(productId);
  
    if (!product) {
      console.error(messagesBuilder.getProductById.notFound(productId));
      return {
        statusCode: StatusCodes.NOT_FOUND,
        headers,
        body: messagesBuilder.getProductById.notFound(productId),
      };
    }

    console.error(messagesBuilder.getProductById.success(product));
    return {
      statusCode: StatusCodes.OK,
      headers,
      body: JSON.stringify(product, null, 2),
    };
  } catch (err) {
    console.error(messagesBuilder.generalError(err));
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      headers,
      body: messagesBuilder.generalError(err),
    };
  } finally {
    await client.disconnect();
  }
};
