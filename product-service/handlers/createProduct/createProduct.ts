import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import { DBClient } from '../../models';
import { messagesBuilder, responseBuilder } from '../../utils';
import { TProduct } from '../../types';

import 'source-map-support/register';

export const createProduct: APIGatewayProxyHandler = async (event, _context) => {
  console.log(messagesBuilder.incomingEvent<APIGatewayProxyEvent>(event));

  const productData: TProduct = event?.body && JSON.parse(event.body);

  if (!productData) {
    console.error(messagesBuilder.createProduct.badRequest());
    return responseBuilder.badRequest(messagesBuilder.createProduct.badRequest());
  }

  const {
    title,
    description,
    price,
    count
  } = productData;
  
  if (!(title && description && price && count)) {
    console.error(messagesBuilder.createProduct.badRequest());
    return responseBuilder.badRequest(messagesBuilder.createProduct.badRequest());
  }

  const client = new DBClient();

  try {
    await client.connect();
    const product = await client.createProduct(productData);
  
    if (!product) {
      console.error(messagesBuilder.createProduct.creationFailed());
      return responseBuilder.serverError(messagesBuilder.createProduct.creationFailed());
    }

    console.log(messagesBuilder.createProduct.success(product));
    return responseBuilder.created(product);
  } catch (err) {
    console.error(messagesBuilder.generalError(err));
    return responseBuilder.serverError(messagesBuilder.generalError(err));
  } finally {
    await client.disconnect();
  }
};
