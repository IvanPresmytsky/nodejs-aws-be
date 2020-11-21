import { StatusCodes } from 'http-status-codes';
import { getCORSHeaders } from '..';

const headers = getCORSHeaders();

export const responseBuilder = {
  success: <T>(body: T) => ({
    statusCode: StatusCodes.OK,
    headers,
    body: JSON.stringify(body, null, 2),
  }),
  created: <T>(body: T) => ({
    statusCode: StatusCodes.CREATED,
    headers,
    body: JSON.stringify(body, null, 2),
  }),
  badRequest: (body: string) => ({
    statusCode: StatusCodes.BAD_REQUEST,
    headers,
    body,
  }),
  notFound: (body: string) => ({
    statusCode: StatusCodes.NOT_FOUND,
    headers,
    body,
  }),
  serverError: (body: string) => ({
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    headers,
    body,
  })
}