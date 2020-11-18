import { APIGatewayProxyEvent, S3Event } from 'aws-lambda';

export const messagesBuilder = {
  importProductFile: {
    incomingEvent: (event: APIGatewayProxyEvent) => `The following event was passed to lamda: ${JSON.stringify(event, null, 2)}`,
    badRequest: () => 'Bad request! "name" query parameter should be provided!',
    success: (url: string) => `The folowing signed url successully created: ${url}`,
    generalError: (err: Error) => `Something went wrong! Details: ${JSON.stringify(err, null, 2)}`,
  },
  importFileParser: {
    incomingEvent: (event: S3Event) => `The following event was passed to lamda: ${JSON.stringify(event, null, 2)}`,
    parsingSuccess: (key: string, data: string) => `Data for ${key} parsed successfully: ${data}!`,
    parsingFailed: (key: string) => `No data for ${key}!`,
    copyingSuccess: (key: string) => `Copied into ${key} successfully!`,
    removingSuccess: (key: string) => `Removed from ${key} successfully!`,
    generalError: (err: Error) => `Something went wrong! Details: ${JSON.stringify(err, null, 2)}`,
  }
};
