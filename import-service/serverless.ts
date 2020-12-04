import type { Serverless } from 'serverless/aws';

const CORSHeaders = {
  'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
  'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
};

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    authorizerArn: {
      'Fn::ImportValue': 'AuthorizationARN',
    },
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    stage: 'dev',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: "${cf:product-service-${self:provider.stage}.SQSQueueUrl}"
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: 'arn:aws:s3:::beer-shop-products'
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: 'arn:aws:s3:::beer-shop-products/*'
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: "${cf:product-service-${self:provider.stage}.SQSQueueArn}"
      }
    ]
  },
  resources: {
    Resources: {
      GatewayResponseAccessDenied: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          RestApiId: {
            Ref: 'ApiGatewayRestApi'
          },
          ResponseType: 'ACCESS_DENIED',
          ResponseParameters: CORSHeaders,
        }
      }, 
      GatewayResponseUnauthorized: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          RestApiId: {
            Ref: 'ApiGatewayRestApi'
          },
          ResponseType: 'UNAUTHORIZED',
          ResponseParameters: CORSHeaders,
        }
      }
    }
  },
  functions: {
    importProductsFile: {
      handler: 'handlers/importProductsFile/importProductsFile.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            cors: true,
            request: {
              parameters: {
                querystrings: {
                  name: true,
                }
              }
            },
            authorizer: {
              name: 'basicAuthorizer',
              arn: '${self:custom.authorizerArn}',
              resultTtlInSeconds: 0,
              identitySource: 'method.request.header.Authorization',
              type: 'token',
            }
          }
        }
      ]
    },
    importFilesParser: {
      handler: 'handlers/importFilesParser/importFilesParser.importFilesParser',
      events: [
        {
          s3: {
            bucket: 'beer-shop-products',
            event: 's3:ObjectCreated:*',
            rules: [
              {
                prefix: 'uploaded',
                suffix: '',
              },
            ],
            existing: true,
          }
        }
      ]
    },
  }
}

module.exports = serverlessConfiguration;
