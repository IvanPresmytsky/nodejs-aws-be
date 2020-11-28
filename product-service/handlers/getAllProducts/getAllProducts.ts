import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';

import { DBClient } from '../../models';
import { messagesBuilder, responseBuilder } from '../../utils';
import 'source-map-support/register';

export const getAllProducts: APIGatewayProxyHandler = async (event, _context) => {
  console.log(messagesBuilder.incomingEvent<APIGatewayProxyEvent>(event));
  const client = new DBClient();

  try {
    await client.connect();
    const products = await client.getAllProducts();

    if (!products?.length) {
      console.error(messagesBuilder.getAllProducts.notFound());
      return responseBuilder.notFound(messagesBuilder.getAllProducts.notFound());
    }

    console.error(messagesBuilder.getAllProducts.success(products.length));
    return responseBuilder.success(products)
  } catch (err) {
    console.error(messagesBuilder.generalError(err));
    return responseBuilder.serverError(messagesBuilder.generalError(err));
  } finally {
    await client.disconnect();
  }
};
