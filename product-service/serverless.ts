import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
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
    httpApi: {
      cors: false,
    }
  },
  functions: {
    getAllProducts: {
      handler: 'handlers/getAllProducts/getAllProducts.getAllProducts',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: false,
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
            cors: false,
          }
        }
      ]
    },
    getCurrentWeather: {
      handler: 'handlers/getCurrentWeather/getCurrentWeather.getCurrentWeather',
      events: [
        {
          http: {
            method: 'get',
            path: 'currentWeather',
            cors: false,
          }
        }
      ]
    },
  }
}

module.exports = serverlessConfiguration;
