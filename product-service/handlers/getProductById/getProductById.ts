import { APIGatewayProxyHandler } from 'aws-lambda';
import { DBClient } from '../../models';
import { getCORSHeaders, messagesBuilder } from '../../utils';
import { TProduct } from '../../types';

import 'source-map-support/register';

export const getProductById: APIGatewayProxyHandler = async (event, _context) => {
  console.log(messagesBuilder.incomingEvent(event));
  const productId = event?.pathParameters?.productId;
  const headers = getCORSHeaders();
  
  if (!productId) {
    console.error(messagesBuilder.getProductById.badRequest());
    return {
      statusCode: 400,
      headers,
      body: messagesBuilder.getProductById.badRequest(),
    };
  }

  const client = new DBClient();

  try {
    await client.connect();
    await client.initDBData();
    const product = await client.getProductById(productId);
  
    if (!product) {
      console.error(messagesBuilder.getProductById.notFound(productId));
      return {
        statusCode: 404,
        headers,
        body: messagesBuilder.getProductById.notFound(productId),
      };
    }

    console.error(messagesBuilder.getProductById.success(product as TProduct));
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(product, null, 2),
    };
  } catch (err) {
    console.error(messagesBuilder.generalError(err));
    return {
      statusCode: 500,
      headers,
      body: messagesBuilder.generalError(err),
    };
  } finally {
    await client.disconnect();
  }
};
