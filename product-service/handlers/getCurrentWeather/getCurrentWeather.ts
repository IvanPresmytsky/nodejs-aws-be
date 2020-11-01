import { APIGatewayProxyHandler } from 'aws-lambda';
import { getCORSHeaders } from '../../utils';
import { getWeather } from './getWeather.helper';
import 'source-map-support/register';

// TODO remove after task-3 review
export const getCurrentWeather: APIGatewayProxyHandler = async (event, _context) => {
  const city = event?.queryStringParameters?.city || 'Brest';

  try {
    const weaherResponse = await getWeather(city);
    return {
      statusCode: 200,
      headers: getCORSHeaders(),
      body: JSON.stringify(weaherResponse.data, null, 2),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify(error, null, 2),
    };
  }
};
