import AWSMock from 'aws-sdk-mock';
import { Context } from 'aws-lambda';

import { responseBuilder, messagesBuilder } from '../../utils';
import { importProductsFile } from './importProductsFile';

describe('importProductsFile handler', () => {
  const context = {} as Context;
  const callback = jest.fn();

  afterEach(() => {
    AWSMock.restore('S3');
  })

  it('should return an error when file name is not provided', async () => {
    const event = {
      queryStringParameters: {},
    } as any;

    const result = await importProductsFile(event, context, callback);

    expect(result).toEqual(responseBuilder.badRequest(messagesBuilder.importProductFile.badRequest()));
  });

  it('should return correct response with url', async () => {
    const event = {
      queryStringParameters: {
        name: 'products.csv'
      },
    } as any;
    const mockSignedUrl = 'https://beer-shop-products.s3.eu-west-1.amazonaws.com/uploaded/products.csv';

    AWSMock.mock('S3', 'getSignedUrl', (_action, _params, callback) => {
      callback(null, mockSignedUrl);
    });

    const result = await importProductsFile(event, context, callback);

    expect(result).toEqual(responseBuilder.success(mockSignedUrl));
  });

  it('should return error response in case of error', async () => {
    const event = {
      queryStringParameters: {
        name: 'products.csv'
      },
    } as any;

    AWSMock.mock('S3', 'getSignedUrl', (_action, _params, callback) => {
      callback({ error: 'error' }, null);
    });

    const result = await importProductsFile(event, context, callback);

    expect(result).toEqual(responseBuilder.serverError(
      messagesBuilder.importProductFile.generalError(new Error('error'))
    ));
  });
});