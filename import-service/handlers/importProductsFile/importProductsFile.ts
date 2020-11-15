import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { responseBuilder, messagesBuilder } from '../../utils';

import 'source-map-support/register';

const BUCKET = 'products-importer';
const REGION = 'eu-west-1';

export const importProductsFile: APIGatewayProxyHandler = async (event, _context) => {
  const catalogName = event?.queryStringParameters?.name;

  if (!catalogName) {
    console.log(messagesBuilder.importProductFile.badRequest())
    return responseBuilder.badRequest(messagesBuilder.importProductFile.badRequest());
  }
  const catalogPath = `uploaded/${catalogName}`;

  const params = {
    Bucket: BUCKET,
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