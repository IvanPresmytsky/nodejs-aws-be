import { StatusCodes } from 'http-status-codes';
import { getCORSHeaders } from '..';

const headers = getCORSHeaders();

export const responseBuilder = {
  success: body => ({
    statusCode: StatusCodes.OK,
    headers,
    body,
  }),
  badRequest: body => ({
    statusCode: StatusCodes.BAD_REQUEST,
    headers,
    body,
  }),
  serverError: body => ({
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    headers,
    body,
  })
}