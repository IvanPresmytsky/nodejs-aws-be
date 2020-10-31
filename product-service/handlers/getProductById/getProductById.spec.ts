import { APIGatewayProxyEvent, Context} from 'aws-lambda';
import * as products from '../../mocks/products.json';
import { errorMessages } from './errorMessages';
import { getProductById } from '.';

describe('getAllProducts handler', () => {
  const context = {} as Context;
  const callback = () => {};


  it('should return a products by related id', async () => {
    const result = await getProductById(
      {
        pathParameters: {
          productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
        },
      } as unknown as APIGatewayProxyEvent,
      context,
      callback,
    );
    const stringifiedProduct = JSON.stringify(products[0], null, 2);

    await expect(result).toEqual({
      statusCode: 200,
      body: stringifiedProduct,
    })
  });

  it('should return a products by related id', async () => {
    const productId = 'incorrect-id';
    const result = await getProductById(
      {
        pathParameters: {
          productId,
        },
      } as unknown as APIGatewayProxyEvent,
      context,
      callback,
    );

    await expect(result).toEqual({
      statusCode: 404,
      body: errorMessages.notFound(productId),
    })
  });
});
