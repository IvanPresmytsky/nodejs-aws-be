import {
  APIGatewayTokenAuthorizerEvent,
  Context,
  Callback,
  APIGatewayAuthorizerResult
} from 'aws-lambda';
import { messagesBuilder, getEffect, generatePolicy } from '../../utils';

export const basicAuthorizer = async (
  event: APIGatewayTokenAuthorizerEvent,
  _Context: Context,
  callback: Callback<APIGatewayAuthorizerResult>
) => {
  console.log(messagesBuilder.incomingEvent(event));

  if(event.type !== 'TOKEN') {
    callback('Unauthorized');
  }

  try {
    const { authorizationToken, methodArn } = event;
    const encodedCredentials = authorizationToken.split(' ')[1];
    const [username, password] = Buffer.from(encodedCredentials, 'base64')
      .toString('utf-8').split(':');

    const effect = getEffect(username, password);
    const policy = generatePolicy(encodedCredentials, methodArn, effect);

    callback(null, policy);
    console.log(messagesBuilder.success())
  } catch (error) {
    console.error(messagesBuilder.generalError(error));
    callback(`Unauthorized: ${error.message}`)
  }
}