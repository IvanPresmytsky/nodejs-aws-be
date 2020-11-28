import { SNS } from 'aws-sdk';

export class SNSClient {
  client: SNS;
  topicArn: string;

  constructor(region, snsArn, SNSService = SNS) {
    this.client = new SNSService({ region });
    this.topicArn = snsArn;
  }

  publish(subject: string, message: string, success: boolean) {
    this.client.publish({
      Subject: subject,
      Message: message,
      TopicArn: this.topicArn,
      MessageAttributes: {
        success: {
          DataType: 'Number',
          StringValue: Number(success).toString(),
        },
      }
    }, (err) => {
      if (err) {
        console.error('Error with sending email: ' + err);
      } else {
        console.log('Send email for: ' + message);
      }
    })
  }
}
