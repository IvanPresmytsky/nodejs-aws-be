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
    },
    documentation: {
      version: '1',
      title: 'products API',
      description: 'products API for craft beer online shop',
      models: {},
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack', 'serverless-openapi-documentation'],
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
/*             documentation: {
              summary: "Get products",
              description: "Get product by specific id",
              pathParams: {
                productId: {
                  description: "The id of the product",
                  scema: {
                    type: "string",
                    pattern: "^[-a-z0-9_]+$",
                  }
                }
              }
            } */
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
