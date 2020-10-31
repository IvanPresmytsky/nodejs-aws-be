import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { getWeather } from './getWeather.helper';

// TODO remove after task-3 review
export const getCurrentWeather: APIGatewayProxyHandler = async (event, _context) => {
  const city = event?.queryStringParameters?.city || 'Brest';

  try {
    const weaherResponse = await getWeather(city);
    console.log('RESPONSE: ', weaherResponse.data);
    return {
      statusCode: 200,
      body: JSON.stringify(weaherResponse.data, null, 2),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify(error, null, 2),
    };
  }
};
