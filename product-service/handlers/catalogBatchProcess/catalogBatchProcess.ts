import { SQSEvent } from 'aws-lambda';
import { SNSClient } from '../../models'
import { messagesBuilder, postProduct } from '../../utils';

export const catalogBatchProcess = async (event: SQSEvent) => {
  console.log(messagesBuilder.incomingEvent<SQSEvent>(event));
  const { REGION, SNS_ARN } = process.env;
  const sns = new SNSClient(REGION, SNS_ARN);

  const promises = event.Records.map(({ body }) => postProduct(body).then(() => {
    sns.publish('Product has been created successfully', body, true);
  }));

  try {
    await Promise.all(promises);
    console.log(messagesBuilder.catalogBatchProcess.success(promises.length));
  } catch (error) {
    sns.publish('Product has been created successfully', error, false);
    console.error(messagesBuilder.generalError(error));
  }
}
