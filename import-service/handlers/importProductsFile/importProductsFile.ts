import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { getCORSHeaders, getUrls } from '../../utils';

import 'source-map-support/register';

const BUCKET = 'products-importer';
const REGION = 'eu-west-1';

export const importProductsFile: APIGatewayProxyHandler = async (event, _context) => {
  const s3 = new S3({ region: REGION });

  const file = event?.queryStringParameters?.file;
  console.log('FILE: ', file);
  const Prefix = file ? `uploaded/${file}.csv` : 'uploaded/';
  console.log('Prefix: ', Prefix);
  const params = {
    Bucket: BUCKET,
    Prefix,
  };

  try {
    const s3Response = await s3.listObjectsV2(params).promise();
    console.log('RESPONSE: ', s3Response);
    const files = s3Response.Contents;

    console.log('FILES: ', files);
    const urls = getUrls(files, BUCKET);
    console.log('URLS: ', urls);
    const body = urls.length > 1 ? JSON.stringify(urls, null, 2) : urls[0];

    return {
      statusCode: 200,
      headers: getCORSHeaders(),
      body,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: getCORSHeaders(),
      body: JSON.stringify(error)
    };
  }
};