import { SQSEvent } from 'aws-lambda';
import { messagesBuilder, postProduct } from '../../utils';

export const catalogBatchProcess = async (event: SQSEvent) => {
  console.log(messagesBuilder.incomingEvent<SQSEvent>(event));
  const promises = event.Records.map(({ body }) => postProduct(body));

  try {
    console.log(messagesBuilder.catalogBatchProcess.success(promises.length));
    await Promise.all(promises)
  } catch (error) {
    console.error(messagesBuilder.generalError(error));
  }
}
