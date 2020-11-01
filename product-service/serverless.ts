import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
  },
  plugins: ['serverless-webpack', 'serverless-aws-documentation'],
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
  },
  functions: {
    getAllProducts: {
      handler: 'handlers/getAllProducts/getAllProducts.getAllProducts',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true,
          }
        }
      ],
    },
    getProductById: {
      handler: 'handlers/getProductById/getProductById.getProductById',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{productId}',
            cors: true,
          }
        },
      ]
    },
    getCurrentWeather: {
      handler: 'handlers/getCurrentWeather/getCurrentWeather.getCurrentWeather',
      events: [
        {
          http: {
            method: 'get',
            path: 'currentWeather',
            cors: true,
          }
        }
      ]
    },
  }
}

module.exports = serverlessConfiguration;
