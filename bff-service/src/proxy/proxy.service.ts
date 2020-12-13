import { Injectable, HttpService, HttpException } from '@nestjs/common';
import { map, catchError } from 'rxjs/operators';
import { AxiosRequestConfig, Method } from 'axios';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';

import getCORSHeaders from './utils/getCORSHeaders';

@Injectable()
export class ProxyService {
  constructor (private httpService: HttpService) {}

  handleRequest(url: string, request: Request, response: Response): Observable<any> {
    const { method, params, headers, body } = request;

    const config: AxiosRequestConfig = {
      url,
      method: method as Method,
      headers: getCORSHeaders(headers),
      ...(Object.keys(body || {}).length && { data: body }),
      ...(Object.keys(params || {}).length && { params }),
    };

    return this.httpService
      .request(config)
      .pipe(
        map(res => {
          return response
            .set({ ...res.headers })
            .status(res.status)
            .json(res.data);
        }),
        catchError(error => {
          throw new HttpException(error.response.data, error.response.status);
        })
      )
  }
}
