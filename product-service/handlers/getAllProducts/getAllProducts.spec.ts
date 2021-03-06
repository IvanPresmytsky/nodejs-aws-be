import { APIGatewayProxyEvent, Context} from 'aws-lambda';
import products from '../../mocks/products.json';
import { getCORSHeaders } from '../../utils';
import { getAllProducts } from '.';

describe('getAllProducts handler', () => {
  it('should return all the products', async () => {
    const result = await getAllProducts({} as APIGatewayProxyEvent, {} as Context, () => {});
    const stringifiedProducts = JSON.stringify(products, null, 2);

    await expect(result).toEqual({
      statusCode: 200,
      headers: getCORSHeaders(),
      body: stringifiedProducts,
    })
  });
});
