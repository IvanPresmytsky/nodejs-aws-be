import { APIGatewayProxyHandler } from 'aws-lambda';
import { DBClient } from '../../models';
import { getCORSHeaders, messagesBuilder } from '../../utils';
import { TProduct } from '../../types';

import 'source-map-support/register';

export const createProduct: APIGatewayProxyHandler = async (event, _context) => {
  console.log(messagesBuilder.incomingEvent(event));
  const headers = getCORSHeaders();

  const productData: TProduct = event?.body && JSON.parse(event.body);

  if (!productData) {
    console.error(messagesBuilder.createProduct.badRequest());
    return {
      statusCode: 400,
      headers,
      body: messagesBuilder.createProduct.badRequest(),
    };
  }

  const {
    id,
    title,
    description,
    price,
    count
  } = productData;
  
  if (!(id && title && description && price && count)) {
    console.error(messagesBuilder.createProduct.badRequest());
    return {
      statusCode: 400,
      headers,
      body: messagesBuilder.createProduct.badRequest(),
    };
  }

  const client = new DBClient();

  try {
    await client.connect();
    const product = await client.createProduct(productData);
  
    if (!product) {
      console.error(messagesBuilder.createProduct.creationFailed());
      return {
        statusCode: 500,
        headers,
        body: messagesBuilder.createProduct.creationFailed(),
      };
    }

    console.error(messagesBuilder.createProduct.success(product as TProduct));
    return {
      statusCode: 201,
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
