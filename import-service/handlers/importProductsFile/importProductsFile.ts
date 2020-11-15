import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { responseBuilder, messagesBuilder } from '../../utils';

import 'source-map-support/register';

export const importProductsFile: APIGatewayProxyHandler = async (event, _context) => {
  const { BUCKET_NAME, REGION } = process.env;
  const catalogName = event?.queryStringParameters?.name;

  if (!catalogName) {
    console.log(messagesBuilder.importProductFile.badRequest())
    return responseBuilder.badRequest(messagesBuilder.importProductFile.badRequest());
  }
  const catalogPath = `uploaded/${catalogName}`;

  const params = {
    Bucket: BUCKET_NAME,
    Key: catalogPath,
    Expires: 60,
    ContentType: 'text/csv',
  };

  try {
    const s3 = new S3({ region: REGION });
    const signedUrl = await s3.getSignedUrl('putObject', params);
    console.log(messagesBuilder.importProductFile.success(signedUrl));
    return responseBuilder.success(signedUrl);
  } catch (error) {
    console.error(messagesBuilder.importProductFile.generalError(error));
    return responseBuilder.serverError(messagesBuilder.importProductFile.generalError(error));
  }
};