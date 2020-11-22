import csv from 'csv-parser'; 
import { S3Event } from 'aws-lambda';
import { S3, SQS } from 'aws-sdk';
import { StatusCodes } from 'http-status-codes';

import { readStream, messagesBuilder } from '../../utils';

export const importFilesParser = async (event: S3Event) => {
  console.log(messagesBuilder.importFileParser.incomingEvent(event));
  const { BUCKET_NAME, BUCKET_REGION, SQS_URL } = process.env;

  try {
    const s3 = new S3({ region: BUCKET_REGION });
    const sqs = new SQS();

    for (const record of event.Records) {
      const originalKey = record.s3.object.key;
      const copiedKey = originalKey.replace('uploaded', 'parsed');
      const copySource = `${BUCKET_NAME}/${originalKey}`;

      const params = {
        Bucket: BUCKET_NAME,
        Key: originalKey,
      };

      const data = await readStream(s3.getObject(params).createReadStream(), csv);
      if (!data) {
        console.error(messagesBuilder.importFileParser.parsingFailed(originalKey));
      }
      console.log(messagesBuilder.importFileParser.parsingSuccess(originalKey, data));

      data.forEach(item => {
        sqs.sendMessage({
          QueueUrl: SQS_URL,
          MessageBody: JSON.stringify(item),
        }, (err, data) => {
          if (err) {
            console.error(`Message sendin failed! Details: ${err}`);
          } else {
            console.log('The message with the following data was sent: ', data);
          }
          return data;
        })
      });

      await s3.copyObject({
        Bucket: BUCKET_NAME,
        CopySource: copySource,
        Key: copiedKey,
      }).promise();

      console.log(messagesBuilder.importFileParser.copyingSuccess(`${BUCKET_NAME}/${copiedKey}`));

      await s3.deleteObject({
        Bucket: BUCKET_NAME,
        Key: originalKey,
      }).promise();

      console.log(messagesBuilder.importFileParser.removingSuccess(originalKey));
    }

    return {
      statusCode: StatusCodes.ACCEPTED,
    };
  } catch (error) {
    console.error(messagesBuilder.importFileParser.generalError(error));

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
}
