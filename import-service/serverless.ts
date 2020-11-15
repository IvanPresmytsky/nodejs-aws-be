import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
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
      }
    ]
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
