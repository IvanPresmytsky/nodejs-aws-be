import { StatusCodes } from 'http-status-codes';
import { getCORSHeaders } from '..';

const headers = getCORSHeaders();

export const responseBuilder = {
  success: (body: string) => ({
    statusCode: StatusCodes.OK,
    headers,
    body,
  }),
  badRequest: (body: string) => ({
    statusCode: StatusCodes.BAD_REQUEST,
    headers,
    body,
  }),
  serverError: (body: string) => ({
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    headers,
    body,
  })
}