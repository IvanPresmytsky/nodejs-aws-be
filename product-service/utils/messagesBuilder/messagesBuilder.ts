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
  DBClient: {
    connectionFailed: (err: Error) => `Failed to connect to the database! Details: ${JSON.stringify(err, null, 2)}`,
    connectionSucess: () => 'Database connection established successfully',
    disconnectionFailed: (err: Error) => `Failed to to disconnect from the database! Details: ${JSON.stringify(err, null, 2)}`,
    disconnectionSucess: () => 'Disconnect from the database',
    DBInitializationFailed: (err: Error | string) => `Something went wrong with DB initialization! Details: ${JSON.stringify(err, null, 2)}`,
    tablesCreationFailed: (err: Error) => `SSomething went wrong with tables creation! Details: ${JSON.stringify(err, null, 2)}`,
    generalError: (err: Error) => `Something went wrong with DB! Details: ${JSON.stringify(err, null, 2)}`,
  },
  generalError: (details: string) => `Something went wrong! Details: ${details}`,
  incomingEvent: (event: APIGatewayProxyEvent) => `The following event was passed to lamda: ${JSON.stringify(event, null, 2)}`,
  success: () => 'Operation completed successfully!',
};
