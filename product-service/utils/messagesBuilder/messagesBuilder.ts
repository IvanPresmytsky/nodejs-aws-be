import { APIGatewayProxyEvent } from 'aws-lambda';
import { TProduct } from '../../types';

export const messagesBuilder = {
  createProduct: {
    badRequest: () => 'Bad request! "id", "title", "description", price and count parameters should be provided!',
    creationFailed: () => 'Failed to create!',
    success: (product: TProduct) => `The folowing product successully created: ${JSON.stringify(product, null, 2)}`,
  },
  getAllProducts: {
    notFound: () => `Products are not found!`,
    success: (count: number) => `Successfully returned ${count} items`,
  },
  getProductById: {
    notFound: (id: string) => `Product with id: ${id} is not found!`,
    badRequest: () => 'Bad request! productId parameter should be provided!',
    success: (product: TProduct) => `Succesfully returned the following product: ${JSON.stringify(product, null, 2)}`,
  },
  generalError: (details: string) => `Something went wrong! Details: ${details}`,
  incomingEvent: (event: APIGatewayProxyEvent) => `The following event was passed to lamda: ${JSON.stringify(event, null, 2)}`,
  success: () => 'Operation completed successfully!',
};
