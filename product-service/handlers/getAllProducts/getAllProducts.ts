import { APIGatewayProxyHandler } from 'aws-lambda';

import { DBClient } from '../../models';
import { getCORSHeaders, messagesBuilder } from '../../utils';
import 'source-map-support/register';

export const getAllProducts: APIGatewayProxyHandler = async (event, _context) => {
  console.log(messagesBuilder.incomingEvent(event));
  const client = new DBClient();
  const headers = getCORSHeaders();

  try {
    await client.connect();
    await client.initDBData();
    const products = await client.getAllProducts();

    if (!products?.length) {
      console.error(messagesBuilder.getAllProducts.notFound());
      return {
        statusCode: 404,
        headers,
        body: messagesBuilder.getAllProducts.notFound(),
      };
    }

    console.error(messagesBuilder.getAllProducts.success(products.length));
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(products, null, 2),
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
