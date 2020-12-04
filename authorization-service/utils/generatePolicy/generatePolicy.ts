import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult
} from 'aws-lambda';
import { EEffectType } from '../../types';

export const generatePolicy = (
  principalId: string,
  Resource: APIGatewayTokenAuthorizerEvent['methodArn'],
  Effect: EEffectType,
): APIGatewayAuthorizerResult => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect,
        Resource,
      }
    ],
  }
});
